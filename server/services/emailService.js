import { getCurrencyDefinition } from "../config/donationCurrencies.js";

const RESEND_ENDPOINT = "https://api.resend.com/emails";
const REQUEST_TIMEOUT_MS = 15000;

function apiKey() {
    return process.env.RESEND_API_KEY?.trim() || "";
}

function fromAddress() {
    return process.env.EMAIL_FROM?.trim() || "";
}

export function isEmailConfigured() {
    return Boolean(apiKey() && fromAddress());
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

export function formatDonationAmount(amount, currency) {
    const definition = getCurrencyDefinition(currency);
    const symbol = definition?.symbol || currency || "";
    const value = Number(amount);
    const formatted = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);
    return `${symbol}${formatted} ${String(currency || "").toUpperCase()}`.trim();
}

function receiptHtml({ donation, campaign }) {
    const donorName = `${donation.firstName || ""} ${donation.lastName || ""}`.trim() || "Donor";
    const date = donation.verifiedAt || donation.paidAt || donation.createdAt || new Date();
    const rows = [
        ["Receipt number", donation.receiptNumber || "—"],
        ["Payment reference", donation.paymentReference || "—"],
        ["Amount", formatDonationAmount(donation.amount, donation.currency)],
        ["Purpose", donation.purpose || "General Offering"],
        ["Payment provider", donation.provider || "—"],
        ["Verified on", new Date(date).toLocaleString("en-GB", { timeZone: "UTC" }) + " UTC"],
    ];
    if (campaign?.title) rows.push(["Campaign", campaign.title]);

    return `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;color:#16213a">
  <div style="max-width:620px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e5e8ef">
    <div style="background:#0d1426;color:#ffffff;padding:24px 28px">
      <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#f5b335">Royal HigherLife Christian Ministries</p>
      <h1 style="margin:10px 0 0;font-size:24px">Donation receipt</h1>
    </div>
    <div style="padding:28px">
      <p style="margin:0 0 16px">Dear ${escapeHtml(donorName)},</p>
      <p style="margin:0 0 20px;line-height:1.6">Thank you for your gift. Your payment was verified successfully and this email is your receipt.</p>
      <table style="width:100%;border-collapse:collapse">
        ${rows
            .map(
                ([label, value]) => `<tr>
          <td style="padding:10px 0;border-bottom:1px solid #eef0f5;color:#64708a;width:42%">${escapeHtml(label)}</td>
          <td style="padding:10px 0;border-bottom:1px solid #eef0f5;font-weight:600;text-align:right">${escapeHtml(value)}</td>
        </tr>`
            )
            .join("")}
      </table>
      <p style="margin:22px 0 0;line-height:1.6;color:#64708a;font-size:13px">No currency conversion was applied: you were charged the amount shown above in ${escapeHtml(donation.currency)}. Your bank or payment provider may charge its own fees.</p>
      <p style="margin:14px 0 0;line-height:1.6;color:#64708a;font-size:13px">Keep this email for your records. If you did not authorise this donation, please contact the church office immediately.</p>
    </div>
  </div>
</body></html>`;
}

async function sendEmail({ to, subject, html, replyTo }) {
    if (!isEmailConfigured()) return { sent: false, reason: "not_configured" };

    let response;
    try {
        response = await fetch(RESEND_ENDPOINT, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${apiKey()}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                from: fromAddress(),
                to: [to],
                subject,
                html,
                ...(replyTo ? { reply_to: replyTo } : {}),
            }),
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });
    } catch (error) {
        return { sent: false, reason: "network_error", error };
    }

    const payload = await response.json().catch(() => null);
    if (!response.ok) {
        return {
            sent: false,
            reason: "provider_error",
            status: response.status,
            error: payload?.message || "Email provider rejected the message.",
        };
    }

    return { sent: true, id: payload?.id || null };
}

export async function sendDonationReceipt({ donation, campaign }) {
    if (!donation?.email) return { sent: false, reason: "missing_recipient" };
    return sendEmail({
        to: donation.email,
        subject: `Donation receipt ${donation.receiptNumber || donation.paymentReference}`,
        html: receiptHtml({ donation, campaign }),
        replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined,
    });
}

export async function sendTrackingCode({ to, reference, code, expiresMinutes = 10 }) {
    if (!to) return { sent: false, reason: "missing_recipient" };
    const html = `<!doctype html>
<html><body style="margin:0;padding:24px;background:#f5f6f8;font-family:Arial,Helvetica,sans-serif;color:#16213a">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;border:1px solid #e5e8ef;padding:28px">
    <p style="margin:0;font-size:12px;letter-spacing:2px;text-transform:uppercase;color:#a06a00">Royal HigherLife Christian Ministries</p>
    <h1 style="margin:10px 0 18px;font-size:22px">Your donation lookup code</h1>
    <p style="margin:0 0 18px;line-height:1.6">Use this one-time code to view the donation receipt for reference <strong>${escapeHtml(reference)}</strong>.</p>
    <p style="margin:0 0 18px;font-size:34px;font-weight:700;letter-spacing:10px;text-align:center">${escapeHtml(code)}</p>
    <p style="margin:0 0 12px;line-height:1.6;color:#64708a;font-size:13px">The code expires in ${Number(expiresMinutes)} minutes. If you did not request it, you can ignore this email.</p>
  </div>
</body></html>`;

    return sendEmail({
        to,
        subject: `Donation lookup code for ${reference}`,
        html,
        replyTo: process.env.EMAIL_REPLY_TO?.trim() || undefined,
    });
}
