const { SellService } = require("../services/sell.service");
const logger = require("../logger");

const sellController = async (req, res) => {
    try {
        const newSell = await SellService.newSell(req.params, req.user);
        res.json({ status: "success", data: newSell });
    } catch (error) {
        logger.error(error.message)
        res.json({ status: "error", message: error.message });
    }
};

module.exports = { sellController }