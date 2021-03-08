if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const mongoose = require("mongoose");

const Campground = require("../models/campground.js");
const cities = require("./cities.js");
const {places, descriptors, photos, authors} = require("./seedHelpers.js");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/yelp-camp";

mongoose.connect(dbUrl, {
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
    for (let i = 0; i < 200; i++)
    {
        const n = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const nAuthor = Math.floor(Math.random() * 5);
        const numImages = Math.floor(Math.random() * 3) + 1;
        
        let options = [];
        for (let j = 0; j < photos.length; j++) {
            options.push(j);
        }

        let images = []
        for (let k = 0; k < numImages; k++) {
            nImage = Math.floor(Math.random() * photos.length);
            options.splice(options.indexOf(nImage), 1);
            const url = photos[nImage];
            const filename = `YelpCamp${url.split("YelpCamp")[1].split(".jpg")[0]}`;
            console.log(filename);
            images.push({
                "url": url,
                "filename": filename
            })
        }

        const camp = new Campground( 
        {
            author: authors[nAuthor],
            location: `${cities[n].city}, ${cities[n].state}`,
            geometry: { 
                "type" : "Point", 
                "coordinates" : [
                    cities[n].longitude,
                    cities[n].latitude,
                ]
            },
            title: `${sample(descriptors)} ${sample(places)}`,
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sequi vel laborum expedita accusantium sapiente quidem cumque, tempora error pariatur repellat ipsum, veniam totam molestiae! Et corporis exercitationem earum facilis deleniti.",
            price,
            images
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})