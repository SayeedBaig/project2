const Listing = require("../models/listing");

module.exports.index  = async(req,res)=>{
const allistings =    await  Listing.find({});
res.render("index.ejs",{allistings});
};

module.exports.renderNewForm = (req,res)=>{
    res.render("../views/new.ejs");
};

module.exports.showListing = async(req,res)=>{
    let {id} = req.params;
   const listing = await Listing.findById(id).populate({path:"reviews",
    populate:{path:"author",
    },
}).populate("owner");
   if(!listing){
    req.flash("error","Listing you requested for does not exitst!");
    return res.redirect("/listings");
   }
   console.log(listing);
   
   res.render("show.ejs",{listing});
};

module.exports.createListing = async(req,res,next)=>{
    let url = req.file.path;
    let filename = req.file.filename;
    // if(!req.body.listen){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    // let result = listingSchema.validate(req.body);
    // console.log(result);
    // if(result.error){
    //     throw new ExpressError(400,result.error);
    // }
  
        //let {title,description,image,price,location,country} = req.body;
    // let listing  = req.body.listing;
    // console.log(listing);
  const newListing =   new Listing(req.body.listing);
//   console.log(req.user);
   newListing.owner = req.user._id;
   newListing.image = {url,filename};
    await newListing.save();
   req.flash("success","New Listing Created!");
   res.redirect("/listings");
    
};


module.exports.renderEditForm = async(req,res)=>{
    //console.log("edit route hit");
    let {id} = req.params;
   const listing = await Listing.findById(id);
    if(!listing){
    req.flash("error","Listing you requested for does not exitst!");
    return res.redirect("/listings");
   }

   let originalImageUrl = listing.image.url;
   originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
   res.render("edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    // if(!req.body.listen){
    //     throw new ExpressError(400,"send valid data for listing");
    // }
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();
   }
   req.flash("success","listing updated ");
   res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","listing deleted ");
    res.redirect("/listings");
};