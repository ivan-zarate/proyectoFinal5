const moogoose=require ("mongoose");
const supertest=require("supertest");
const chai=require("chai");
const {app}= require("../app");
const {productsMongo} = require("../daos/dbModels/product.model")

const request=supertest(app);
const expect=chai.expect;

describe("Suite test",()=> {
    it("endpoint should bring an array of 4 products",async()=>{
        console.log("Prueba 1");
        const response=await request.get("/api/products");
        expect(response.body.status).equal("success");
        expect(response.body.data.length).to.equal(4);
    });
    it("endpoint should create an unique id for the new product", async()=>{
        console.log("Prueba 2");
        const newProduct={
            name:"Mintion | Beagle Camera | 3D Printer Camera | 32GB",
            description:"Mintion Beagle camera is a dual-use 3d printer camera that allows you to monitor and control your 3D printer remotely, while also making it easy to create time-lapse videos.",
            code:3366990,
            url:"https://cdn.shopify.com/s/files/1/0261/3710/0359/products/20221019202912_750x750.jpg?v=1672394071",
            price:9810,
            stock:90,
            incart:false  
        };
        const response = await request.post("/api/products").send(newProduct);
        expect(response.body.status).equal("success");
        expect(response.body.data).to.haveOwnProperty("_id");
    });
    it("endpoint should modify the price of the product",async()=>{
        console.log("Prueba 3");
        const modifiedProduct={
            name:"Mintion | Beagle Camera | 3D Printer Camera | 32GB",
            description:"Mintion Beagle camera is a dual-use 3d printer camera that allows you to monitor and control your 3D printer remotely, while also making it easy to create time-lapse videos.",
            code:3366990,
            url:"https://cdn.shopify.com/s/files/1/0261/3710/0359/products/20221019202912_750x750.jpg?v=1672394071",
            price:13810,
            stock:90, 
        };
        const result= await productsMongo.findOne({ name:"Mintion | Beagle Camera | 3D Printer Camera | 32GB"});
        const newProduct={
            _id:result._id,
            ...modifiedProduct
        }
        const response = await request.put(`/api/products/${result._id}`).send(newProduct);
        expect(response.body.status).equal("Producto modificado con exito");
        const afterPut= await productsMongo.findOne({ name:"Mintion | Beagle Camera | 3D Printer Camera | 32GB"});
        expect(afterPut.price).to.equal(13810);
    });
    it("endpoint should delete the product created in test",async ()=>{
        console.log("Prueba 4");
        const result= await productsMongo.findOne({ name:"Mintion | Beagle Camera | 3D Printer Camera | 32GB"});
        const response = await request.delete(`/api/products/${result._id}`);
        expect(response.body.status).equal("Producto eliminado con exito");
    })
})
