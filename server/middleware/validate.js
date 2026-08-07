const validate = (fields) => (req, res, next) => {
    const missing = fields.filter(
        (field) => req.body[field] === undefined || String(req.body[field]).trim() === ""
    );
    if (missing.length) {
        return res.status(400).json({
            success: false,
            message: `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`,
        });
    }
    next();
};
export default validate;
