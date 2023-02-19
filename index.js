const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();

const PORT = 9999;

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

let db = new sqlite3.Database('./ecommerce.db', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the ecommerce database.');
});

app.get('/',(req,res) => {
    res.status(200).json({"success":"succcess"});
});

app.get('/products',(req,res) => {
    db.all(`SELECT products.id,products.title,products.price,products.description,products.image,categories.category FROM products INNER JOIN categories ON products.category==categories.id`,[],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(200).json(rows);
    });
});

app.get('/products/categories/:categoryId',(req,res) => {
    const categoryId = req.params.categoryId;
    db.all(`SELECT products.id,products.title,products.price,products.description,products.image,categories.category FROM products INNER JOIN categories ON products.category==categories.id WHERE categories.id=?`,[categoryId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":`No products found!`});
            return;
        }
        res.status(200).json(rows);
    });
});

app.get('/products/:productId',(req,res) => {
    const productId = req.params.productId;
    db.all(`SELECT products.id,products.title,products.price,products.description,products.image,categories.category FROM products INNER JOIN categories ON products.category==categories.id WHERE products.id=?`,[productId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        res.status(200).json(rows);
    });
});

app.post('/products',(req,res) => {

    console.log(req.body);
    if(!req.body){
        res.status(400).json({"error":"body required"});
        return;
    }
    let {title,price,description,image,category} = req.body;

    if(!title){
        res.status(400).json({"error":"Required field title is missing"});
        return;
    }else if(!price){
        res.status(400).json({"error":"Required field price is missing"});
        return;
    }else if(!category){
        res.status(400).json({"error":"Required field category is missing"});
        return;
    }

    description = (description)?description:'';
    image = (image)?image:'';

    db.all(`SELECT * FROM categories where category=?`,[category],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":`No categories available in the data base with name ${category}`});
            return;
        }
        const categoryId = rows[0].id;
        db.run(`INSERT INTO products(title,price,description,image,category) VALUES(?,?,?,?,?)`,[title,price,description,image,categoryId],(err,result) => {
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }
            res.status(201).json({title,price,description,image,category});
        });
    });
});

app.put('/products/:productId',(req,res) => {
    const productId = req.params.productId;
    console.log(req.body);
    if(!req.body){
        res.status(400).json({"error":"body required"});
        return;
    }
    let {title,price,description,image,category} = req.body;
    if(!title){
        res.status(400).json({"error":"Required field title is missing"});
        return;
    }else if(!price){
        res.status(400).json({"error":"Required field price is missing"});
        return;
    }else if(!category){
        res.status(400).json({"error":"Required field category is missing"});
        return;
    }
    description = (description)?description:'';
    image = (image)?image:'';
    db.all(`SELECT id FROM products WHERE id=?`,[productId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        db.all(`SELECT * FROM categories where category=?`,[category],(err,rows) => {
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }
            if(rows.length == 0){
                res.status(400).json({"error":`No categories available in the data base with name ${category}`});
                return;
            }
            const categoryId = rows[0].id;
            db.run(`UPDATE products  SET title=?,price=?,description=?,image=?,category=? WHERE id=?`,[title,price,description,image,categoryId,productId],(err,result) => {
                if(err){
                    res.status(400).json({"error":err.message});
                    return;
                }
                res.status(200).json({title,price,description,image,category});
            });
        });
    });
});

app.patch('/products/:productId',(req,res) => {
    const productId = req.params.productId;
    console.log(req.body);
    if(!req.body){
        res.status(400).json({"error":"body required"});
        return;
    }
    
    let {title,price,description,image,category} = req.body;
    
    db.all(`SELECT * FROM products WHERE id=?`,[productId],(err,productsRows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(productsRows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        title = (title)?title:productsRows[0].title;
        price = (price)?price:productsRows[0].price;
        description = (description)?description:productsRows[0].description;
        image = (image)?image:productsRows[0].image;
        let updateQuery = `UPDATE products SET title=?,price=?,description=?,image=?,category=? WHERE id=?`;    
        if(category){
            db.all(`SELECT * FROM categories where category=?`,[category],(err,rows) => {
                if(err){
                    res.status(400).json({"error":err.message});
                    return;
                }
                if(rows.length == 0){
                    res.status(400).json({"error":`No categories available in the data base with name ${category}`});
                    return;
                }
                const categoryId = rows[0].id;
                db.run(updateQuery,[title,price,description,image,categoryId,productId],(err,result) => {
                    if(err){
                        res.status(400).json({"error":err.message});
                        return;
                    }
                    res.status(200).json({title,price,description,image,category});
                    return;
                });
            });
        }
        if(!category){
            db.run(`UPDATE products SET title=?,price=?,description=?,image=? WHERE id=?`,[title,price,description,image,productId],(err,result) => {
                if(err){
                    res.status(400).json({"error":err.message});
                    return;
                }
                res.status(200).json({title,price,description,image,category});
            });
        }
    });
});

app.delete('/products/:productId',(req,res) => {
    const productId = req.params.productId;
    db.all(`SELECT id FROM products WHERE id=?`,[productId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        db.run(`DELETE FROM products WHERE id=?`,[productId],(err,result) => {
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }
            res.status(204).json();
        });
    });
});

app.get('/categories',(req,res) => {
    db.all(`SELECT * FROM categories`,[],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(200).json(rows);
    });
});

app.post('/categories',(req,res) => {
    console.log(req.body);
    if(!req.body){
        res.status(400).json({"error":"body required"});
        return;
    }
    const {category} = req.body;
    if(!category){
        res.status(400).json({"error":"Required field category is missing"});
        return;
    }
    db.run(`INSERT INTO categories(category) VALUES(?)`,[category],(err,result) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(201).json({category});
    });
});

app.get('/carts',(req,res) => {
    db.all(`select carts.id,users.username,products.title,ordered_products.quantity,products.price,(ordered_products.quantity*products.price) as "Total price" from carts inner join users on carts.userId=users.id inner join ordered_products on carts.orderID=ordered_products.id inner join products on ordered_products.product=products.id`,[],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(200).json(rows);
    });
});


app.get('/carts/users/:userId',(req,res) => {
    const userId = req.params.userId;
    db.all(`select carts.id,users.username,products.title,ordered_products.quantity,products.price,(ordered_products.quantity*products.price) as "Total price" from carts inner join users on carts.userId=users.id inner join ordered_products on carts.orderID=ordered_products.id inner join products on ordered_products.product=products.id where users.id=?`,[userId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        res.status(200).json(rows);
    });
});

app.get('/users',(req,res) => {
    db.all(`select users.id,users.username,users.email,users.fullname,users.phone,address.address_line_1,address.address_line_2,address.city,address.state,address.zipcode from users inner join address on users.address=address.id`,[],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(200).json(rows);
    });
});

app.get('/users/:userId',(req,res) => {
    const userId = req.params.userId;
    db.all(`select users.id,users.username,users.email,users.fullname,users.phone,address.address_line_1,address.address_line_2,address.city,address.state,address.zipcode from users inner join address on users.address=address.id where users.id=?`,[userId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No data found!"});
            return;
        }
        res.status(200).json(rows);
    });
});

app.post('/users',(req,res) => {
    console.log(req.body);
    if(!req.body){
        res.status(400).json({"error":"body required"});
        return;
    }
    let {email,username,password,fullname,phone,address_line_1,address_line_2,city,state,zipcode} = req.body;
    if(!email){
        res.status(400).json({"error":"Required field email is missing"});
        return;
    }else if(!username){
        res.status(400).json({"error":"Required field username is missing"});
        return;
    }else if(!password){
        res.status(400).json({"error":"Required field password is missing"});
        return;
    }else if(!fullname){
        res.status(400).json({"error":"Required field fullname is missing"});
        return;
    }else if(!phone){
        res.status(400).json({"error":"Required field phone is missing"});
        return;
    }else if(!address_line_1){
        res.status(400).json({"error":"Required field address_line_1 is missing"});
        return;
    }else if(!address_line_2){
        res.status(400).json({"error":"Required field address_line_2 is missing"});
        return;
    }else if(!city){
        res.status(400).json({"error":"Required field city is missing"});
        return;
    }else if(!state){
        res.status(400).json({"error":"Required field state is missing"});
        return;
    }else if(!zipcode){
        res.status(400).json({"error":"Required field zipcode is missing"});
        return;
    }

    db.run(`INSERT INTO address(address_line_1,address_line_2,city,state,zipcode) VALUES(?,?,?,?,?)`,[address_line_1,address_line_2,city,state,zipcode], function(err){
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        let addressID = this.lastID;
        db.run(`INSERT INTO users(email,username,password,fullname,phone,address) VALUES(?,?,?,?,?,?)`,[email,username,password,fullname,phone,addressID],function(err){
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }
            res.status(201).json({"id":this.lastID,email,username,fullname,phone,address_line_1,address_line_2,city,state,zipcode});
        });
    });
});


app.put('/users/:userId',(req,res) => {
    const userId = req.params.userId;
    console.log(req.body);
    if(!req.body){
        res.status(400).json({"error":"body required"});
        return;
    }
    let {email,username,password,fullname,phone,address_line_1,address_line_2,city,state,zipcode} = req.body;
    if(!email){
        res.status(400).json({"error":"Required field email is missing"});
        return;
    }else if(!username){
        res.status(400).json({"error":"Required field username is missing"});
        return;
    }else if(!password){
        res.status(400).json({"error":"Required field password is missing"});
        return;
    }else if(!fullname){
        res.status(400).json({"error":"Required field fullname is missing"});
        return;
    }else if(!phone){
        res.status(400).json({"error":"Required field phone is missing"});
        return;
    }else if(!address_line_1){
        res.status(400).json({"error":"Required field address_line_1 is missing"});
        return;
    }else if(!address_line_2){
        res.status(400).json({"error":"Required field address_line_2 is missing"});
        return;
    }else if(!city){
        res.status(400).json({"error":"Required field city is missing"});
        return;
    }else if(!state){
        res.status(400).json({"error":"Required field state is missing"});
        return;
    }else if(!zipcode){
        res.status(400).json({"error":"Required field zipcode is missing"});
        return;
    }
    db.all(`SELECT id FROM users WHERE id=?`,[userId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        db.run(`UPDATE address SET address_line_1=?,address_line_2=?,city=?,state=?,zipcode=? WHERE id IN (SELECT address FROM users WHERE id=?)`,[address_line_1,address_line_2,city,state,zipcode,userId],(err,result) => {
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }           
            db.run(`UPDATE users SET email=?,username=?,password=?,fullname=?,phone=? WHERE id=?`,[email,username,password,fullname,phone,userId],(err,result) => {
                if(err){
                    res.status(400).json({"error":err.message});
                    return;
                }
                res.status(200).json({email,username,fullname,phone,address_line_1,address_line_2,city,state,zipcode});
            });
        });
    });
});

app.delete('/users/:userID',(req,res) => {
    const userID = req.params.userID;
    db.all(`SELECT id FROM users WHERE id=?`,[userID],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        db.run(`DELETE FROM users WHERE id=?`,[userID],(err,result) => {
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }
            res.status(204).json();
        });
    });
});

app.get('/stock',(req,res) => {
    db.all(`select products.title,stock.quantity from stock inner join products on stock.product=products.id`,[],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        res.status(200).json(rows);
    });
});

app.get('/stock/:productId',(req,res) => {
    const productId = req.params.productId;
    db.all(`select products.title,stock.quantity from stock inner join products on stock.product=products.id where products.id=?`,[productId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No data found!"});
            return;
        }
        res.status(200).json(rows);
    });
});

app.put('/stock/:productId',(req,res) => {
    const productId = req.params.productId;
    const {quantity} = req.body;
    if(!quantity){
        res.status(400).json({"error":"missing field quantity missing"});
        return;
    }
    db.all(`SELECT * FROM stock WHERE product=?`,[productId],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }   
        db.run(`update stock set quantity=?  where stock.product=?`,[quantity,productId],(err,result) => {
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }
            res.status(200).json({quantity});
        });
    });
});

app.delete('/stock/:productID',(req,res) => {
    const productID = req.params.productID;
    db.all(`SELECT product FROM stock WHERE product=?`,[productID],(err,rows) => {
        if(err){
            res.status(400).json({"error":err.message});
            return;
        }
        if(rows.length == 0){
            res.status(404).json({"error":"No product found!"});
            return;
        }
        db.run(`DELETE FROM stock WHERE product=?`,[productID],(err,result) => {
            if(err){
                res.status(400).json({"error":err.message});
                return;
            }
            res.status(204).json();
        });
    });
});

app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));