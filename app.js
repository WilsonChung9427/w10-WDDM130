const express = require('express');
const path = require('path');
const {check, validationResult} = require('express-validator');
const app = express();


app.use(express.urlencoded({extended:true}));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.render('form');
});

app.post('/processForm', [
    check('name', 'Must have a name').notEmpty(),
    check('email', 'Must have email').isEmail(),
    check('tickets', 'Tickets Not selected').notEmpty(),
    check('campus', 'Campus Not Selected').notEmpty(),
    check('lunch', 'Lunch option must be selected').notEmpty(),
    check('postcode', 'Wrong Code Format').matches(/^[A-Za-z]\d[A-Za-z]\s\d[A-Za-z]\d$/),
    check('phone', 'Invalid Phone Number').matches(/^\d{3}(\s|-)\d{3}(\s|-)\d{4}$/)

    ],(req, res)=>{

        const errors = validationResult(req);
        if(errors.isEmpty()){

            var lunch_index = -1, cost = 0, tax, total;

            var name = req.body.name;
            var email = req.body.email;
            var post = req.body.postalcode;
            var phone = req.body.phone;
            var campus = req.body.campus;
            var tickets = req.body.tickets;
            var lunch = req.body.lunch;

            for(var i =0; i< lunch.length; i++){
                if(lunch[i].checked){
                    lunch_index = i;
                    break;
                }
            }

            if(lunch_index > -1){
                lunch = lunch[lunch_index].value;
            }

            if(tickets > 0){
                cost = 100*tickets;
            }

            if(lunch =='yes'){
                cost += 60;
            }

            tax=cost*0.13;
            total = cost + tax

            var receipt = {
                "name":name,
                "email":email,
                "lunch":lunch,
                "campus":campus,
                "sub":cost.toFixed(2),
                "tax":tax.toFixed(2),
                "total":total.toFixed(2),
            }

            res.render('form',{recpt: receipt})
        }
        else{
            res.render('form', {errors:errors.array()})
        }
    });

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});