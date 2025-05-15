const sellerOrder = require("../model/SellerOrder");

const sellerOrderController = {
    getSellerOrder : async (req, res)=>{
        try{
            const id = req.params.sellerId;
            const data = await sellerOrder.find({seller_id : id});

            res.status(200).json({
                success : true,
                message : "Order fetched success",
                data : data
            })
        }
        catch(error){
            console.log(error);
            res.status(500).json({
                success : false,
                message : "Internal server error",
                error : error.message
            })
        }
    }

}

module.exports = sellerOrderController;