const mongoose = require("mongoose");

const Campground = require("../models/campground.js");
const cities = require("./cities.js");
const {places, descriptors} = require("./seedHelpers.js");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Established connection to database")
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++)
    {
        const n = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground( 
        {
            author: "601a21e8b9412810d3aa750c",
            location: `${cities[n].city}, ${cities[n].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi vel laborum expedita accusantium sapiente quidem cumque, tempora error pariatur repellat ipsum, veniam totam molestiae! Et corporis exercitationem earum facilis deleniti.",
            price: price,
            images:  [
                {
                    "url" : "https://res.cloudinary.com/dgclala73/image/upload/v1613416068/YelpCamp/zikmpyymkngo8nr48gpl.jpg", 
                    "filename" : "YelpCamp/zikmpyymkngo8nr48gpl" 
                }, 
                {
                    "url" : "https://res.cloudinary.com/dgclala73/image/upload/v1613416072/YelpCamp/szem1x7b4dqi8wo1hdpu.jpg", 
                    "filename" : "YelpCamp/szem1x7b4dqi8wo1hdpu" 
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})