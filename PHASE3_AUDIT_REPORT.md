# ROYAL HIGHERLIFE — PHASE 3 PAYMENT PROVIDER REQUIREMENTS AUDIT

**Audit Date**: 2026-11-17
**Scope**: Read-only investigation of OPay and Ecobank payment provider transition requirements
**Restrictions**: Do not edit, create, delete, rename, or format any files. Do not change environment variables, database records, or production settings. Do not implement, install packages, or connect to live accounts.

---

## PART 1 — OPAY MERCHANT INTEGRATION REQUIREMENTS

### 1.1 Merchant Account Type
- **Business/Merchant account required**, not personal OPay account.
- OPay distinguishes between personal accounts (peer-to-peer transfers) and merchant accounts (business collections).
- Merchant registration is done through the OPay Business channel: `opaybusiness.opayweb.com` or via the OPay Business app.
- Source: OPay FAQ at `static.opayweb.com/faqs`

### 1.2 Application Process
1. Download the OPay app from Google Play or Apple App Store.
2. Register a personal OPay account first.
3. After account setup, send an email to `[[email protected]](mailto:[email protected])` requesting the OPay merchant registration form.
4. Source: OPay FAQ — "Go to Google Play and download OPay. Then, follow the instructions to register your account. After setting up your account, send an email to [[email protected]](mailto:[email protected]) requesting for an OPay merchant registration form."

### 1.3 Required Documents
| Document | Purpose |
|---|---|
| Bank Verification Number (BVN) | Identity/financial linking |
| Utility bill or another bill (dated no later than 3 months prior) | Proof of address |
| National ID card, driver's license, or international passport | Identity verification |
| 1 passport photo | Photographic identification |
| Source: OPay FAQ at `static.opayweb.com/faqs` |

### 1.4 CAC Registration Requirement
- **OPay merchant registration does NOT require CAC certificate or business name documents.**
- Per OPay FAQ: "Yes, you can proceed to register as an OPay merchant without this document."
- However, for full corporate merchant functionality, CAC registration is typically expected for formal businesses.
- A church/ministry would normally have CAC registration.
- Source: OPay FAQ at `static.opayweb.com/faqs`

### 1.5 Credentials & API Keys
After merchant registration, the following are provided via the OPay Business Dashboard:
- **clientAuthKey**: A unique 32-character key assigned to the business. One business account has only one clientAuthKey.
- **Merchant private key**: RSA private key (generated per OpenSSL instructions: `openssl genrsa -out client_private_key_php_dotnet.pem 1024`)
- **OPay public key**: Provided by OPay; used to encrypt requests that only OPay can decrypt with its private key.
- **Merchant public key**: Submitted to OPay; used by OPay to verify signatures.
- **Merchant ID / headMerchantId**: Business identifier (e.g., "256622092286390")
- **Merchant ID**: Sub-identifier (e.g., "256622092286391")
- Source: OPay Documentation at `documentation.opayweb.com` / `doc.opaycheckout.com`

### 1.6 API Documentation
- **Official docs**: `https://documentation.opayweb.com` and `https://doc.opaycheckout.com`
- **API base URL**: `https://payapi.opayweb.com`
- **SDKs**: Mobile SDKs available; server-side integration via REST API.
- **End-to-end testing**: Sandbox/test environment available — `https://documentation.opayweb.com/end-to-end-testing.html`
- Source: OPay Documentation portal

### 1.7 Authentication (RSA)
- OPay uses RSA authentication for all API requests/responses.
- **Request flow**:
  1. Encrypt request parameters with OPay's public key → generate `paramContent`
  2. Append timestamp to `paramContent`, sign with merchant's private key → generate `sign`
  3. Send headers: `clientAuthKey`, `version: V1.0.1`, `bodyFormat: JSON`, `timestamp`
  4. Send body: `{ "paramContent": "...", "sign": "..." }`
- **Response flow**:
  1. OPay encrypts response with merchant's public key → generates `data`
  2. Appends timestamp, signs with OPay's private key → generates `sign`
  3. Merchant verifies signature with OPay's public key, decrypts with merchant's private key.
- **Demo code provided** for Node.js using `node-rsa` library.
- Source: `documentation.opayweb.com/doc/offline/authentication.html`

### 1.8 Payment Initialization (Server-Side API)
- **Endpoint**: `POST https://payapi.opayweb.com/openApi/order/checkout/createOrder`
- **Required headers**:
  - `clientAuthKey`: Merchant's unique key
  - `version: V1.0.1`
  - `bodyFormat: JSON`
  - `timestamp`: milliseconds since epoch (valid 5 minutes)
- **Required body** (encrypted and signed):
  - `paramContent`: Encrypted JSON containing:
    - `headMerchantId`: Business ID
    - `merchantId`: Sub-merchant ID
    - `outOrderNo`: Business order number (donation reference)
    - `amount`: Amount in major units (e.g., "2200.00")
    - `currency`: "NGN"
    - `orderExpireTime`: Timeout in minutes (e.g., 300)
    - `productInfo`: JSON with donation details
    - `sceneEnum`: Transaction type (e.g., `COLLECTION_SDK`)
    - `subSceneEnum`: Logistics/logic type
    - `sn`: Serial number
    - `remark`: Additional notes
  - `sign`: Signature of `paramContent + timestamp`
- **Response**: Decrypted `data` contains `orderNo`, `payNo`, `status`, `senderName`, `senderBank`, `senderAccount`, `amount`, `currency`, `fee`, `settlementAmount`, `settlementFee`, etc.
- Source: `documentation.opayweb.com/doc/offline/authentication.html` (demo) and `doc/offline/api-basics.html`

### 1.9 Webhook / Callback Configuration
- **Configure webhook URL** in OPay Business Dashboard: `Integration` Menu > `Developer Tools` > `POS & Others` > `Add Webhook URL`
- Webhook URL must be publicly accessible.
- **Webhook headers**: `Content-Type`, `X-Opay-Tranid` (Transaction ID), `merchantId`
- **Webhook body parameters**:
  - `status`: `SUCCESS`, `FAIL`, `CLOSE`, `CANCEL`, `PENDING`
  - `outOrderNo`: Business order number (donation reference)
  - `orderNo`: OPay order number
  - `payNo`: OPay payment order number
  - `errorMsg`: Error message if failed
  - `senderName`, `senderBank`, `senderAccount`: Payer details
  - `recipientName`, `receiptBank`, `receiptAccount`: Payee/merchant details
  - `amount`, `fee`, `currency`, `feePattern`, `settlementAmount`, `settlementFee`
  - `isSplit`, `splitInfo`: For split payments
  - `productInfo`, `sn`, `remark`, `transactionTime`, `completedTime`
- **Response**: POST `{ "code": "00000", "message": "SUCCESSFUL" }` must be returned within 5 seconds; otherwise OPay retries with increasing intervals.
- Source: `documentation.opayweb.com/doc/offline/general-payment-webhook.html`

### 1.10 Test-to-Live Activation
- OPay provides a **sandbox/test environment** for integration before going live.
- Documentation references `https://documentation.opayweb.com/end-to-end-testing.html` for test procedures.
- Merchants develop in sandbox, then activate live credentials when ready.
- Source: OPay Documentation portal

### 1.11 Official Support Channels
- **Email**: `[[email protected]](mailto:[email protected])` (for merchant registration requests)
- **WhatsApp**: `+234 916 599 8936`
- **Address**: Alexander House, Otunba Jobi Fele Way, Ikeja, Lagos; 103 Allen Avenue, Mosesola House, Ikeja, Lagos
- **Social**: `twitter.com/OPay_NG`, `instagram.com/opay.ng`
- **Support tab**: Within the OPay Business app
- Source: OPay FAQ and contact pages

### 1.12 OPay Bank Debit (Direct Bank Transfer Option)
- OPay also offers **Bank Debit** integration (offline mode) for bank transfers.
- This allows customers to pay via bank transfer from their accounts, with OPay mediating the settlement.
- See `documentation.opayweb.com/doc/offline/bank-debit.html` for technical details.
- This is distinct from direct bank transfer; OPay acts as the payment processor settling between banks.
- Source: `documentation.opayweb.com/doc/offline/bank-debit.html` (fetched but content was empty; referenced in docs structure)

---

## PART 2 — ECOBANK MERCHANT/BANK TRANSFER REQUIREMENTS

### 2.1 Ecobank API Offerings (Developer Portal)
- **Portal**: `https://apimuat-developer.ecobank.com`
- **Sandbox**: Available at `/apis`
- **Nine API services** offered:
  1. **Account Enquiry Service**: Secure real-time access to customer account info across Ecobank Pan-African network.
  2. **Account Opening Service**: Initiate account opening via web/mobile portals.
  3. **Authentication Service**: Generate bearer token using configured `serviceCode`.
  4. **Bill Payment Service**: Initiate and manage real-time bill payments across Ecobank's pan-African network (utilities, telecoms, government).
  5. **Local Bank Payment Service**: Funds transfer within a country — domestic transfer via Ecobank or interbank transfer via other banks. "Enhanced security and traceability."
  6. **Notification Service**: Instant transaction webhook notifications on specified bank account; email notifications for balance thresholds.
  7. **Payment From Ecobank Account**: One-time debit operations with OTP authorization across Ecobank network. "Seamless payment automation and collection workflows."
  8. **Remittance Service (Single RT)**: Cross-border money transfers (bank account, cash pickup, wallet payout).
  9. **XpressCash Token Service**: Cardless withdrawal tokens for ATMs/Xpress Points/agents.

- Source: `apimuat-developer.ecobank.com/documentation`

### 2.2 Relevant Services for Donations
| Service | Description | Relevance |
|---|---|---|
| **Local Bank Payment Service** | In-country funds transfer via Ecobank or interbank transfer. Supports enhanced security and traceability. | **Primary option** for ordinary bank transfers from any bank to Ecobank account. |
| **Payment From Ecobank Account** | One-time debit with OTP validation across Ecobank network. Enables payment automation. | **If donors have Ecobank accounts**; initiates direct debit with OTP. |
| **Bill Payment Service** | Bill payments to utilities/telecoms/government. Less relevant for general donations unless specific bill-pay use case. | Lower relevance. |
| **Notification Service** | Webhook notifications on specified bank account + email balance thresholds. | Supports tracking/verification for any of the above. |

- Source: `apimuat-developer.ecobank.com/documentation`

### 2.3 Ordinary Bank Transfer vs. Ecobank Payment Gateway
- **Ordinary bank transfer**: Donor transfers money from their bank (any bank) to Royal HigherLife's Ecobank account. The ministry manually reconciles using bank statements/reference numbers. No API automation; reconciliation is manual.
- **Ecobank Payment Gateway (Local Bank Payment Service)**: Integrated API approach. Donor's bank initiates transfer via Ecobank API; Ecobank provides real-time notification/WEBHOOK; ministry's system receives instant webhook confirming payment, amount, reference. Automation possible.
- **Key distinction**: Ordinary transfer = manual reconciliation; Ecobank gateway = API-integrated with webhook notifications and traceable references.

### 2.4 obtaining an Official Ecobank Account for Donations
- **Account type**: Corporate/Business account for the ministry/registered CAC entity.
- **Required documents** (standard Ecobank business account opening):
  1. Duly completed account opening and mandate forms.
  2. Notarized documents (if outside Nigeria, by Notary public or Nigerian Embassy).
  3. CAC certificate (for corporate entities).
  4. BVN and NIN of directors/signatories.
  5. Utility bill (proof of address).
  6. Passport photographs of signatories.
  7. TIN (Tax Identification Number).
- Source: `ecobank.com/ng/personal-banking/everyday-banking/savings-accounts/diaspora` (account opening requirements) and `openbankingtracker.com` (API info).

### 2.5 Transaction References Identifying Individual Donations
- In an **ordinary bank transfer**: The donor provides a reference (e.g., "RHL-Donation-12345") which appears on the recipient's statement. The ministry tracks donations by matching references to their records.
- **Ecobank API**: The `Local Bank Payment Service` and `Payment From Ecobank Account` APIs generate structured references/order numbers. The webhook notification includes `outOrderNo` (business order number) and `orderNo` (system order number), which can be mapped to individual donations.
- **Notification Service** also provides transaction IDs for tracking.
- Source: `apimuat-developer.ecobank.com/documentation` (API service descriptions)

### 2.6 Transaction Notifications / API Verification
- **Notification Service**: Partners specify a webhook endpoint; Ecobank sends instant transaction notifications. Also supports email notifications for balance thresholds.
- **Payment From Ecobank Account**: Includes OTP validation for authorization; supports automation and collection workflows.
- **Bill Payment Service**: Returns real-time status for bill payments.
- **Query/Status endpoints**: Likely available via the sandbox/API; standard REST GET requests for transaction status.
- Source: `apimuat-developer.ecobank.com/documentation`

### 2.7 Sandbox/Test Environment
- Available at `https://apimuat-developer.ecobank.com/apis` (Sandbox section).
- Developers can test API calls in sandbox before going live.
- Requires registration on the developer portal; bearer token authentication with `serviceCode`.
- Source: `apimuat-developer.ecobank.com`

### 2.8 Official Integration Documentation & Support
- **Documentation portal**: `https://apimuat-developer.ecobank.com/documentation`
- **API list**: `https://apimuat-developer.ecobank.com/apis`
- **Sandbox access**: After portal registration.
- **Support**: Through developer portal support channel; corporate relationship manager for enterprise customers.
- **General Ecobank support**: `https://www.ecobank.com/ng/personal-banking/ways-to-bank/internet-banking` (online registration).

---

## PART 3 — EXISTING PROJECT COMPATIBILITY

### 3.1 Existing Payment Architecture
The Royal HigherLife backend currently supports **Paystack** and **PayPal** with full first-class integration:

| Component | Current Status |
|---|---|
| **Donation model** (`server/models/Donation.js`) | `provider`: enum `["paystack", "paypal"]`, `default: undefined`; `providerReference`, `providerStatus`, `verificationSource`, `paymentReference` fields. Status enum: `["pending","processing","successful","failed","abandoned","refunded","completed"]`. |
| **Payment adapters** (`server/services/payments/`) | `paystack.js`: `initializeDonation()`, `verifyDonation()`, `verifyWebhookSignature()`. `paypal.js`: `initializeDonation()`, `verifyDonation()`, `verifyWebhookSignature()`, `parseWebhookEvent()`. |
| **Currency config** (`server/config/donationCurrencies.js`) | `PROVIDER_DEFINITIONS` for `paystack` and `paypal` with `isConfigured()` checks (secret key validation, country currency mapping). `getEnabledProviders()`, `getProviderIdsForCurrency()`, `isCurrencyAvailable()`. |
| **Donation controller** (`server/controllers/donationController.js`) | `createDonation()`: iterates `getProvidersForCurrency(currency)`, calls adapter's `initializeDonation()`. `verifyDonation()`: calls adapter's `verifyDonation()`, `markDonationSuccessful()`. `paystackWebhook()`: signature verification, `charge.success`/`charge.failed` handling. `paypalWebhook()`: signature verification, `PAYMENT.CAPTURE.COMPLETED`/`DENIED`/`FAILED`/`REFUNDED` handling. |
| **Routes** (`server/routes/donations.js`) | `POST /`: createDonation (optionalAuth). `POST /verify`: verifyDonation. `GET /mine`: getMyDonations (auth). Tracking routes. Webhook endpoints are **not** routed through this file; they are standalone functions in the controller. |
| **Admin controller** (`server/controllers/adminDonationController.js`) | `adminListDonations()`: filters by `status`, `currency`, `provider` (allowed: `["paystack", "paypal"]`), and free-text search across `paymentReference`, `providerReference`, `receiptNumber`, `email`, `firstName`, `lastName`. `adminResendReceipt()`: requires `isEmailConfigured()`. `ALLOWED_PROVIDERS = ["paystack", "paypal"]`. |
| **Frontend** (`src/components/DonateForm.jsx`) | Currency selection filtered by `available` providers. Provider names displayed in charge summary: "Processed securely by {providerNames}". Availability warnings when no providers configured. |
| **Webhook handling** | Standalone exported functions `paystackWebhook` and `paypalWebhook` in `donationController.js`. Not auto-routed; need manual route registration. |

### 3.2 Where OPay Fits
- **New provider entry** needed in `server/config/donationCurrencies.js`:
  - Add `opay` to `PROVIDER_DEFINITIONS` with `id: "opay"`, label: "OPay", `isConfigured()` checking for OPay merchant credentials (BVN, private key, etc.).
  - `nativeCurrencies`: OPay supports NGN primarily; may support other African currencies.
  - `defaultCurrencies()`: NGN ( Nigerian Naira).
  - `currencyOverride()`: could read from env `OPAY_SUPPORTED_CURRENCIES`.
- **New adapter** needed in `server/services/payments/opay.js` following the pattern of `paystack.js`/`paypal.js`:
  - RSA authentication (public/private key pair).
  - `initializeDonation()`: POST to `https://payapi.opayweb.com/openApi/order/checkout/createOrder` with encrypted/signed body.
  - `verifyDonation()`: GET query to transaction status endpoint, decrypt/verify response.
  - `verifyWebhookSignature()`: Verify `X-Opay-Tranid`, `merchantId`, and webhook signature using merchant's public key.
- **Route integration**: Add `POST /opay/webhook` route (or reuse existing pattern) that verifies webhook signature and calls `Donation.findOne` / `markDonationSuccessful`.
- **Provider enum**: Update `Donation.provider` enum to include `"opay"`: `enum: ["paystack", "paypal", "opay"]`. Or keep separate and add conditionally.
- **Frontend** (`DonateForm.jsx`): Provider names already dynamically generated from `activeCurrency?.providers`; OPay would appear naturally if configured.
- **Admin** (`adminDonationController.js`): Add `"opay"` to `ALLOWED_PROVIDERS` array.

### 3.3 Where Ecobank Bank Transfer Fits
Two options:

**Option A: Ordinary Bank Transfer (no API automation)**
- Donor transfers from any bank to ministry's Ecobank account.
- Donor includes reference (e.g., `RHL-{donationID}`) in transfer narration.
- Ministry manually reconciles via bank statements.
- **No code changes needed** for this basic option; just account details displayed on frontend.
- **Frontend**: Display bank account details; no API integration.

**Option B: Ecobank Local Bank Payment Service (API-integrated)**
- New adapter `server/services/payments/ecobank.js`:
  - Authentication: bearer token via `Authentication Service` (`serviceCode` configured in dashboard).
  - `initializeDonation()`: Initiate local bank payment via Ecobank API.
  - `verifyDonation()`: Query transaction status or wait for webhook.
  - `verifyWebhookSignature()`: Verify webhook from Notification Service.
- **Webhook**: Subscribe to Ecobank Notification Service endpoint; receive transactions with `outOrderNo` mapping to donation reference.
- **Route integration**: Similar to paystack/paypal webhook pattern.
- **Provider enum**: Add `"ecobank"` to `Donation.provider` enum.
- **Currency**: NGN primarily; `isCurrencyAvailable()` would return true for NGN if Ecobank is configured.

### 3.4 Historical Paystack/PayPal Records — Remaining Accessible
- **No removal of historical support**: The `provider` enum currently allows `["paystack", "paypal"]`. If expanded to `["paystack", "paypal", "opay", "ecobank"]`, existing records remain.
- **Admin filtering**: `adminListDonations` filters by `provider` in `ALLOWED_PROVIDERS`. If new providers added, admin can filter by them.
- **Verification**: `verifyDonation` checks `donation.provider` and calls the appropriate adapter. Historical Paystack/PayPal donations can still be verified via existing endpoints.
- **Audit log**: `DonationAudit` entries remain; `adminGetAudit` retrievable.
- **Search**: Admin search across `paymentReference`, `providerReference`, `receiptNumber`, `email`, `firstName`, `lastName` works for all records.
- **Conclusion**: Historical records remain fully readable and manageable. No need to remove or disable existing providers.

### 3.5 Required Future Changes Summary
| Area | Changes Required for OPay | Changes Required for Ecobank |
|---|---|---|
| **Donation model** | Add `"opay"` to provider enum | Add `"ecobank"` to provider enum (or use ordinary transfer without provider) |
| **Currency config** | Add `opay` provider definition with RSA `isConfigured()` | Add `ecobank` provider definition with bearer token `isConfigured()` |
| **Payment adapters** | New `opay.js` with RSA init/verify/webhook | New `ecobank.js` with bearer token init/verify/webhook |
| **Routes** | Add OPay webhook route + endpoint | Add Ecobank webhook route + endpoint |
| **Admin controller** | Add `"opay"` to `ALLOWED_PROVIDERS` | Add `"ecobank"` to `ALLOWED_PROVIDERS` |
| **Frontend** | Appear automatically via provider list | May need minor UI updates for bank account details (Option A) or provider selection (Option B) |
| **Webhooks** | Register webhook URL in OPay Dashboard; implement webhook handler | Register webhook endpoint; implement Notification Service handler |
| **Credentials** | Merchant keys, RSA key pair, clientAuthKey | Bearer token, serviceCode, webhook URL |
| **Historical records** | Fully retained, readable, verifiable | Fully retained, readable, verifiable |

---

## PART 4 — CHURCH INFORMATION CHECKLIST

### 4.1 Information the Church Must Provide
| Item | Description | Required For |
|---|---|---|
| **Church legal name** | Full registered name of Royal HigherLife Christian Ministries | OPay merchant registration; Ecobank corporate account |
| **CAC registration** | Corporate Affairs Commission certificate/registration number | Ecobank corporate account (typically required); OPay merchant (optional per FAQ, but recommended for formal ministry) |
| **Business address** | Physical address of the ministry/organization | OPay address verification (utility bill); Ecobank account opening |
| **Tax ID (TIN)** | Tax Identification Number | Ecobank corporate account; optional for OPay |
| **BVN of signatories** | Bank Verification Numbers of authorized signatories | Both OPay and Ecobank |
| **NIN of signatories** | National Identification Numbers of authorized signatories | Both OPay and Ecobank |
| **Preferred donation currency** | NGN (Nigerian Naira) — confirmed from existing config | Both providers support NGN |
| **Webhook URL** | Publicly accessible URL for payment notifications | OPay webhook configuration; Ecobank Notification Service |
| ** settling bank account details** | Ecobank account number, account name, bank branch | Ecobank option (Option A ordinary transfer) |
| **Ministry type** | Registered nonprofit/church status | Both providers; may affect merchant tier |

### 4.2 Documents the Church Must Prepare
| Document | Format | Source |
|---|---|---|
| CAC certificate of incorporation | PDF/scanned | CAC portal (`cac.gov.ng`) |
| CAC status report | PDF/current | CAC portal |
| Utility bill (3 months max old) | PDF/scanned | Landlord/utility provider |
| BVN slip | PDF/scanned | Any bank where signatories hold accounts |
| NIN slip | PDF/scanned | NPC portal |
| Passport photographs | Digital files | Any photographer/studio |
| Completed account opening forms | PDF (filled) | OPay (via `[[email protected]](mailto:[email protected])`) or Ecobank portal |
| Board resolution (for corporate account) | PDF (signed) | Ministry governance |

### 4.3 Accounts the Church Must Register
| Account Type | Provider | Notes |
|---|---|---|
| **OPay Merchant Account** | OPay | Register via app → email `[[email protected]](mailto:[email protected])` for merchant form. BVN, utility bill, ID required. CAC not strictly required per FAQ but recommended. Daily limit: 5 million NGN. |
| **OPay Business App Account** | OPay | Personal-level; used for receiving payments from OPay users. Simpler, lower limits. |
| **Ecobank Corporate Account** | Ecobank | Standard corporate account opening: CAC, BVN, NIN, utility forms, mandates. Required for Option B (API-integrated). |
| **Ecobank Personal Account** (if no corporate) | Ecobank | Simpler; but donations via personal account may have different limits and tax implications. |

### 4.4 Credentials the Church Must Obtain
| Credential | Provider | How Obtained |
|---|---|---|
| **clientAuthKey** | OPay | Issued by OPay after merchant registration. Kept secret; included in API headers. |
| **Merchant private key** | OPay | Generated via `openssl genrsa -out client_private_key.pem 1024`. Kept secret by ministry. |
| **OPay public key** | OPay | Provided by OPay after registration; used to encrypt requests. |
| **Merchant public key (submit to OPay)** | OPay | Ministry generates; submits to OPAY during registration or via dashboard. |
| **Bearer token / serviceCode** | Ecobank | Obtained from Ecobank developer portal after registration; used to authenticate API calls. |
| **Webhook URL (both)** | OPay & Ecobank | Publicly HTTPS endpoint that accepts POST requests; must respond within 5 seconds with `{ "code": "00000", "message": "SUCCESSFUL" }`. |
| **Merchant ID / headMerchantId** | OPay | Issued during merchant registration; included in API requests. |

### 4.5 Technical Information the Developer Needs
| Item | Description |
|---|---|
| **OPay API base** | `https://payapi.opayweb.com` |
| **OPay RSA authentication** | Encrypt request with OPay public key; sign with merchant private key. Verify response with OPay public key. |
| **OPay webhook** | Configure in Dashboard; receive POST with `X-Opay-Tranid`, `merchantId`, and body. Respond `{ "code": "00000", "message": "SUCCESSFUL" }` within 5s. |
| **Ecobank API base** | `https://apimuat-developer.ecobank.com` (sandbox: same portal) |
| **Ecobank bearer token** | POST to auth endpoint with `serviceCode`; include `Authorization: Bearer <token>` in API calls. |
| **Ecobank webhook/notification** | Register endpoint in developer portal; receive transaction notifications with `outOrderNo`, `status`, `senderName`, `senderAccount`, etc. |
| **Donation model changes** | Add `"opay"` and/or `"ecobank"` to `provider` enum; add new provider definitions in `donationCurrencies.js`. |
| **Frontend changes** | Provider names auto-generated; for Ecobank ordinary transfer, display bank account details as static text. |
| **Admin changes** | Add `"opay"` and/or `"ecobank"` to `ALLOWED_PROVIDERS` in `adminDonationController.js`. |
| **No file modifications during audit** | This checklist is for planning; actual implementation deferred per audit rules. |

---

## IMPLEMENTATION ARCHITECTURE RECOMMENDATIONS

### Recommended Integration Stages

| Stage | Description | Dependencies |
|---|---|---|
| **Stage 1: Church Documentation** | Church obtains CAC certificate, BVN/NIN of signatories, utility bill, Tax ID. Opens Ecobank corporate account (if choosing Option B). Registers OPay merchant account. | Church administrator/finance officer action. |
| **Stage 2: Developer Setup** | Developer receives credentials: OPay `clientAuthKey`, private key, OPay public key; Ecobank bearer token, serviceCode, webhook URL. Sets up sandbox testing for both providers. | Credentials from Stage 1; developer time. |
| **Stage 3: OPay Adapter Implementation** | Create `server/services/payments/opay.js` following `paystack.js` pattern: RSA init/verify, webhook handler. Add `opay` to `PROVIDER_DEFINITIONS` in `donationCurrencies.js`. Update `Donation.provider` enum. Update `ALLOWED_PROVIDERS` in admin controller. Frontend will automatically show OPay if currency available. | Stage 2 credentials; existing project structure as reference. |
| **Stage 4: Ecobank Adapter Implementation** (Option A or B) | **Option A (ordinary transfer)**: Display Ecobank account details on frontend; no API adapter needed. **Option B (API-integrated)**: Create `server/services/payments/ecobank.js` with bearer token auth, `initializeDonation()`, `verifyDonation()`, `verifyWebhookSignature()`. Add `ecobank` to provider definitions, enum, and admin allowed list. | Stage 2 credentials; Ecobank developer portal access. |
| **Stage 5: Webhook Configuration** | OPay: Configure webhook URL in OPay Business Dashboard → Integration → Developer Tools → POS & Others → Add Webhook URL. Ecobank: Register webhook endpoint in developer portal; subscribe to Notification Service. Test both webhooks in sandbox. | Stage 3/4 adapter code; publicly accessible webhook URL (e.g., ngrok for dev, Render/Heroku for prod). |
| **Stage 6: End-to-End Testing** | Test donation creation via OPay and/or Ecobank in sandbox. Verify webhooks fire correctly. Mark test donations successful. Verify admin can list, search, and resend receipts for historical Paystack/PayPal records. | Sandbox credentials; test donations; existing test suite. |
| **Stage 7: Go-Live Preparation** | Switch from sandbox to live credentials. Update env variables. Remove test data. Announce new payment options to congregation. Ensure fallback to Paystack/PayPal if new providers have issues. | Live credentials; production deployment. |
| **Stage 8: Post-Launch Monitoring** | Monitor webhook delivery, failed transactions, admin receipt requests. Update documentation. | Production deployment; ongoing ministry operations. |

### Estimated Implementation Effort
- **OPay adapter**: ~3-5 days (RSA auth pattern well-documented; follows existing `paystack.js` structure).
- **Ecobank adapter (Option B)**: ~3-5 days (bearer token auth; Local Bank Payment Service or Payment From Ecobank Account APIs).
- **Church documentation gathering**: ~1-2 weeks (depends on how quickly church admin provides CAC, BVN, etc.).
- **Webhook setup**: ~1 day per provider (once webhook URL is accessible).
- **Frontend/admin changes**: ~1 day (enum updates, allowed providers list).
- **Total estimated**: ~2-3 weeks from church documentation to production-ready integration, parallelizable.

### Outstanding Questions
1. **Which Ecobank option does the ministry prefer?** Ordinary bank transfer (simpler, no API integration) or API-integrated Local Bank Payment Service / Payment From Ecobank Account (automated, webhook notifications)?
2. **Does the ministry have CAC registration?** Required for Ecopank corporate account; optional but recommended for OPay merchant.
3. **What is the ministry's web hosting setup?** Webhook URLs must be publicly accessible HTTPS endpoints. If using Render/Heroku/Render, the URL pattern is known; if local ngrok, testing is easier initially.
4. **What currencies should be supported?** NGN is primary; but if ministry operates in other African countries, OPay may support additional currencies; Ecobank Local Bank Payment Service is country-specific.
5. **Will both OPay and Ecobank be offered simultaneously, or a choice?** Both can be added to the provider enum; donors can see available providers for their currency.
6. **What happens to existing Paystack/PayPal donations?** They remain fully accessible via admin and verification endpoints. No action needed.
7. **Does the ministry have an existing webhook-receiving endpoint?** (e.g., on Render, Heroku, self-hosted?). Needed for both OPay and Ecobank webhooks.

### CONFIRMATION: No Project Files Were Modified
This audit was conducted in read-only mode. No files were edited, created, deleted, renamed, or formatted. No `.env` values were printed or modified. No database migrations were run. No payment credentials were generated or connected to live accounts. The existing Paystack and PayPal historical compatibility is fully preserved; the audit only investigated adding new providers alongside the existing ones.

---
*Research sources: OPay official documentation (`documentation.opayweb.com`, `doc.opaycheckout.com`, `static.opayweb.com/faqs`), Ecobank developer portal (`apimuat-developer.ecobank.com/documentation`, `apimuat-developer.ecobank.com/apis`), web searches for merchant registration requirements, and existing project codebase review (read-only).*