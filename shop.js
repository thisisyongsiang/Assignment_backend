import express from 'express';
import * as db from './database.js';

const router = express.Router();


router.get("/customer/all",(req,res)=>{
db.connection.all(`select * from customer`,(err,results)=>{
    if(err)res.status(500).send('Unable to Retrieve customer list');
    else{
        res.status(200).send(results);
    }
})
});
router.get("/customer/email",(req,res)=>{
    db.connection.all(
        `select * from customer where customer.email='${req.query.cid}'`,
        (err,result)=>{
            if (err)res.status(500).send('Unable to Retrieve customer');
            else if (!result)res.status(200).send("no such customer email available");
            else{
                res.status(200).send(result);
            }
        }
    )
});

//get items that customer purchased and total quantity
router.get("/customer/email/items",(req,res)=>{
    db.connection.all(`select item.id,item.price,item.name,sum(shop_order.quantity) 
    from item inner join shop_order on
    item.id=shop_order.itemID
        where shop_order.custEmail='${req.query.cid}'
        group by item.id`,(err,results)=>{
            if (err) res.status(500).send('some error occured');
            else{
                let output=results.map((val)=>{return({
                    id:val.id,
                    price:val.price,
                    name:val.name,
                    totalQuantity:val['sum(shop_order.quantity)']
                }
                )})
                res.status(200).send(output);
            }
        })

})

router.post("/customer/add",(req,res)=>{
    db.connection.all(`insert into customer(name,email) values('${req.body.name}','${req.body.email}')`,(err,results)=>{
        if (err) res.status(500).send('Unable to Add Item');
        else{
            res.status(201).send(results);
        }
    })
})

router.put("/customer/email",(req,res)=>{
    db.connection.all(`update customer
    set name='${req.body.name}'
    where customer.email='${req.body.email}'`,(err,results)=>{
        if(err)res.status(500).send('unable to update');
        else{res.status(200).send(results);}
    })
})

router.delete("/customer/email",(req,res)=>{
    db.connection.all(`delete from customer where customer.email='${req.query.cid}'`,(err,results)=>{
        if (err) res.status(500).send('Unable to Delete Item');
        else{
            res.status(200).send(results);
        }
    })
})

router.get('/shoporder/all',(req,res)=>{
    db.connection.all(`select * from shop_order`,(err,results)=>{
        if(err)res.status(500).send('Unable to Retrieve Order list');
        else{
            res.status(200).send(results);
        }
    })
    });
    router.get("/shoporder/id",(req,res)=>{
        db.connection.all(`select * from shop_order where shop_order.id =' ${req.query.orderid}'`,(err,results)=>{
            if (err) res.status(500).send('Unable to Retrieve Order');
            else{
                res.status(200).send(results);
            }
        })
    })
    router.get("/shoporder/orderdate",(req,res)=>{
        db.connection.all(`select * from shop_order 
        where shop_order.order_date >='${req.query.startdate}'
        and shop_order.order_date<='${req.query.enddate}'`,(err,results)=>{
            if (err) res.status(500).send('Unable to Retrieve Order');
            else{
                res.status(200).send(results);
            }
        })
    });
    
    router.post("/shoporder/add",(req,res)=>{
        db.connection.all(`insert into shop_order(id,custEmail,itemID,quantity,address,order_date,shipping_date) 
        values('${req.body.id}','${req.body.custEmail}','${req.body.itemID}',${req.body.quantity},'${req.body.address}','${req.body.order_date}','${req.body.shipping_date}')`,
        (err,results)=>{
            if (err) res.status(500).send('Unable to Add Item');
            else{
                res.status(201).send(results);
            }
        })
    })
    router.put("/shoporder/id",(req,res)=>{
        db.connection.all(`update shop_order
        set 
        custEmail='${req.body.custEmail}',itemID='${req.body.itemID}',quantity='${req.body.quantity}',address='${req.body.address}'
        ,order_date='${req.body.orderDate}',shipping_date='${req.body.shippingDate}'
        where shop_order.id='${req.body.id}'`,(err,results)=>{
            if(err)res.status(500).send('unable to update');
            else{res.status(200).send(results);}
        })
    })
    router.delete("/shoporder/id",(req,res)=>{
        db.connection.all(`delete from shop_order where shop_order.id='${req.query.orderid}'`,(err,results)=>{
            if (err) res.status(500).send('Unable to Delete Item');
            else{
                res.status(200).send(results);
            }
        })
    })

    router.get("/item/all",(req,res)=>{
        db.connection.all(`select * from item`,(err,results)=>{
            if (err) res.status(500).send('Unable to Retrieve Item List');
            else{
                res.status(200).send(results);
            }
        })
    });
    router.get("/item/id",(req,res)=>{
        db.connection.all(`select * from item where item.id ='${req.query.itemid}'`,(err,results)=>{
            if (err) res.status(500).send('Unable to Retrieve Item');
            else{
                res.status(200).send(results);
            }
        })
    })
    router.get("/item/id/customer",(req,res)=>{
        db.connection.all(`select * from customer 
        where customer.email in 
        (select shop_order.custEmail from shop_order 
            where shop_order.itemID = '${req.query.itemid}')`,(err,results)=>{
                if(err){
                    res.status(500).send('Unable to Retrieve Customer');
                }
                else{
                    res.status(200).send(results);
                }
            })
    });

    router.post("/item/add",(req,res)=>{
        db.connection.all(`insert into item(id,name,price) values('${req.body.id}','${req.body.name}',${req.body.price})`,(err,results)=>{
            if (err) res.status(500).send('Unable to Add Item');
            else{
                res.status(201).send(results);
            }
        })
    })
    router.put("/item/id",(req,res)=>{
        db.connection.all(`update item
        set name='${req.body.name}',price='${req.body.price}'
        where item.id='${req.body.id}'`,(err,results)=>{
            if(err)res.status(500).send('unable to update');
            else{res.status(200).send(results);}
        })
    })
    
    router.delete("/item/id",(req,res)=>{
        db.connection.all(`delete from item where item.id='${req.query.itemid}'`,(err,results)=>{
            if (err) res.status(500).send('Unable to Delete Item');
            else{
                res.status(200).send(results);
            }
        })
    })
export{router};
