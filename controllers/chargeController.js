const asyncErrorWrapper = require("express-async-handler");
var Stripe = require("stripe");
// don't commit your real stripe secret key... use env variables!!
// https://www.leighhalliday.com/secrets-env-vars-nextjs-now

const charge = asyncErrorWrapper(async (req, res) => {
  const {STRIPE_KEY}=process.env
  const stripe = new Stripe(STRIPE_KEY);
voice
  const { id, amount } = req.body;

  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency: "GBP",
      description: "Delicious empanadas",
      payment_method: id,
      confirm: true
    });

    console.log(payment);

    return res.status(200).json({
      confirm: "abc123"
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: error.message
    });
  }
});

const secure = asyncErrorWrapper(async (req, res) => {
    const {STRIPE_KEY}=process.env
    const stripe = new Stripe(STRIPE_KEY);
  
    const { amount } = req.body;
  
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "GBP",
            automatic_payment_methods: {enabled: true},
        });
  
      console.log(paymentIntent);
  
      return res.status(200).json({client_secret: paymentIntent.client_secret,id:paymentIntent.id});
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: error.message
      });
    }
  });

  const cancel = asyncErrorWrapper(async (req, res) => {
    const {STRIPE_KEY}=process.env
    const stripe = new Stripe(STRIPE_KEY);
  
    const { id } = req.body;
    console.log(id);
  
    try {
        const refund = await stripe.paymentIntents.cancel(id)
       // const refund = await stripe.refunds.create({
        //    payment_intent: id,
        //    });
        console.log(refund);
  
      return res.status(200).json({canceled:true});
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        message: error.message
      });
    }
  });

module.exports={charge,secure,cancel}
