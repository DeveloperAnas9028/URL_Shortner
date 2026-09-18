import express from "express";
import generateCode from "../utils/generateCode.js";
import urlModel from "../model/url.model.js";

const router = express.Router();

router.post('/', async function (req, res) {
    const { url } = req.body;

    //Validations for URL 
    if (!url) {
        return res.status(400).json({
            error: "URL is required"
        });
    }

    //Valid Protocol (http or https)
    if ((url.startsWith('http://') == false) && (url.startsWith("https://") == false)) {
        return res.status(400).json({
            message: "Please enter a valid URL http:// or https://"
        });
    }

    //Length requirement 
    if (url.length > 2048) {
        return res.status(400).json({
            message: "URL is too long."
        });
    }

    //Code for creating new url
    const code = generateCode();

    const newUrl = await urlModel.create({
        originalUrl: url,
        shortCode: code
    });


    return res.status(201).json({
        message: "URL Shortend Successfully",
        data: {
            originalUrl: newUrl.originalUrl,
            shortCode: newUrl.shortCode,
        }
    });


})


//Reading Url
router.get("/", async function (req, res) {
    const urls = await urlModel.find();

    return res.status(201).json({
        message: "URL Fetched Successfully",
        data: {
            urls
        }
    });
});

//Method for deleting url data
router.delete("/:id", async function (req, res) {
    const { id } = req.params;
    
    const url = await urlModel.findById({
        _id: id
    });

    if(!url) {
        return res.status(404).json({
            message:"URL not found"
        })
    }

    await urlModel.findByIdAndDelete({
        _id:id
    });
    return res.status(200).json({
        message:"URL deleted successfully"
    })

});



export default router;