function renderBanner(banner_template,home_banner,banners){
    var item_list = [];
    var item_rendered = [];
    var banner_template_html = $(banner_template).html();
    Mustache.parse(banner_template_html);   // optional, speeds up future uses
    $.each( banners , function( key, val ) {
        today = new Date();
        start = new Date (val.start_date);
       
        start.setDate(start.getDate());
        if(val.url == "" || val.url === null){
           val.css = "style=cursor:default;";
           val.noLink = "return false";
        }
        if (start <= today){
            if (val.end_date){
                end = new Date (val.end_date);
                end.setDate(end.getDate() + 1);
                if (end >= today){
                    item_list.push(val);  
                }
            } else {
                item_list.push(val);
            }
        }
    });

    $.each( item_list , function( key, val ) {
        var repo_rendered = Mustache.render(banner_template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(home_banner).html(item_rendered.join(''));
}

function renderContest(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val){
        val.image_url = "https://www.mallmaverick.com" + val.photo_url;
        val.property_name = getPropertyDetails().name;
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    
    $(container).html(item_rendered.join(''));
}
        
function renderEvents(container, template, collection, centre){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.image_url = store_details.store_front_url_abs;
            if(store_details.categories != null){    
                val.cat_list = store_details.categories.join(',')
            }
        } else {
            val.store_name = centre;
            val.image_url = "//codecloud.cdn.speedyrails.net/sites/56c740936e6f642d56000000/image/png/1456246178000/promo_image.png";
        }
        if (val.image_url.indexOf('missing.png') > 0){
            val.image_url  = "//codecloud.cdn.speedyrails.net/sites/56c740936e6f642d56000000/image/png/1456246178000/promo_image.png";
        }
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }
        if (val.event_image_url_abs.indexOf('missing.png') > -1){
            val.event_image_url_abs="//codecloud.cdn.speedyrails.net/sites/56c740936e6f642d56000000/image/png/1456246178000/promo_image.png";
        }

        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        } else {
        	val.dates = start.format("MMM D") + " - " + end.format("MMM D");
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderEventDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.eventable_type == "Store") {
            var store_details = getStoreDetailsByID(val.eventable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.store_image = store_details.store_front_url_abs;
            val.store_slug = store_details.slug
            if (store_details.website != null && store_details.website.length > 0){
                val.show = "display:block";
                val.website = store_details.website
            } else {
                val.show = "display:none";
            }
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else{
                val.phone_show = "display:none";
                val.show = "display:none";
            }
        } else {
            val.store_name = mall_name;
            val.store_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
            val.store_show = "display:none";
            val.phone_show = "display:none";
            val.show = "display:none";
        }
        val.image_url = val.event_image_url_abs
        
        if(val.image_url.indexOf('missing.png') > 0){
            val.image_url  = "//codecloud.cdn.speedyrails.net/sites/56c740936e6f642d56000000/image/png/1456246178000/promo_image.png";
        }
        
        if(val.event_image_url_abs.indexOf('missing.png') > -1){
            val.promo_image_show="display:none";
        }
        
        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        } else {
        	val.dates = start.format("MMM D") + " - " + end.format("MMM D");
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderFeatureItems(){
    var items = getFeatureList();
    $.each(items, function(i, val){
        $('#feature_' + i).html('<a href="'+ val.url +'"><img src="'+ val.image_url+'" class="hoverer" alt="' +val.name+ '"><h5 class="center_h">'+ val.name +'</h5></a>')
    })
}

function renderGallery(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.photo_url.indexOf('missing.png') > -1) {
            val.gallery_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
        } else {
            val.gallery_image = "//www.mallmaverick.com" + val.photo_url;
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderGeneral(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        var repo_rendered = Mustache.render(template_html,val);
        item_rendered.push(repo_rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHomeHours(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);    
    $.each( item_list , function( key, val ) {
        val.day = moment().format("ddd");
        var d = moment();
        val.month = moment().month();
        val.weekday = moment().date();
        if (val.open_time && val.close_time && (val.is_closed == false || val.is_closed == null)){
            var open_time = moment(val.open_time).tz(getPropertyTimeZone());
            var close_time = moment(val.close_time).tz(getPropertyTimeZone());
            val.h = val.day + " " + open_time.format("h:mmA") + " - " + close_time.format("h:mmA");
        } else {
            val.h = "Closed";
            $('.hours_dot').css("background", "#cd1629");
        }
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderHours(container, template, collection, type){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    if (type == "property_details"){
        item_list.push(collection);
        collection = []
        collection = item_list;
    }
    if (type == "reg_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == false) {
                switch(val.day_of_week) {
                case 0:
                    val.day = "Sunday"
                    break;
                case 1:
                    val.day = "Monday"
                    break;
                case 2:
                    val.day = "Tuesday"
                    break;
                case 3:
                    val.day = "Wednesday"
                    break;
                case 4:
                    val.day = "Thursday"
                    break;
                case 5:
                    val.day = "Friday"
                    break;
                case 6:
                    val.day = "Saturday"
                    break;
            }
            if (val.open_time && val.close_time && val.is_closed == false){
                var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                val.h = open_time.format("h:mmA") + " - " + close_time.format("h:mmA");
            } else {
                "Closed"
            }
                item_list.push(val)
            }
        });
        collection = []
        collection = item_list;
    }
    if (type == "holiday_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = holiday.format("ddd, MMM D, YYYY");
                
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM"
                    }
                    if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM"
                    }
                    val.h = open_time.format("h:mmA") + " - " + close_time.format("h:mmA");
                } else {
                    val.h = "Closed"
                }
                if (val.h != "Closed"){
                    item_list.push(val)
                }
            }
        });
        collection = []
        collection = item_list;
    }
    if (type == "closed_hours") {
        $.each( collection , function( key, val ) {
            if (!val.store_id && val.is_holiday == true) {
                holiday = moment(val.holiday_date).tz(getPropertyTimeZone());
                var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                val.formatted_date = holiday.format("ddd, MMM D, YYYY");
                
                if (val.open_time && val.close_time && val.is_closed == false){
                    var open_time = moment(val.open_time).tz(getPropertyTimeZone());
                    var close_time = moment(val.close_time).tz(getPropertyTimeZone());
                    if (val.open_time == "0:00 AM"){
                        val.open_time = "12:00 AM"
                    }
                    if (val.close_time == "0:00 AM"){
                        val.close_time = "12:00 AM"
                    }
                    val.h = open_time.format("h:mmA") + " to " + close_time.format("h:mmA");
                } else {
                    val.h = "Closed"
                }
                if (val.h == "Closed") {
                    item_list.push(val)
                }
            }
        });
        collection = []
        collection = item_list;
    }
    $.each( collection , function( key, val ) {
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobs(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if(val.jobable_type == "Store"){
            val.store_name = getStoreDetailsByID(val.jobable_id).name;
            val.store_slug = getStoreDetailsByID(val.jobable_id).slug;
            val.store_show = "display:block";
        } else {
            val.store_name = mall_name;
            val.store_show = "display:none";
        }
        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description;
        }

        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        val.published_on = show_date.format("MMM D");
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderJobDetails(container, template, collection, mall_name){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if(val.jobable_type == "Store"){
            var store_details = getStoreDetailsByID(val.jobable_id);
            val.store_name = store_details.name;
            val.store_image = store_details.store_front_url_abs;
            if (store_details.website != null && store_details.website.length > 0){
                val.show = "display:block";
                val.website = store_details.website
                val.store_slug = store_details.slug
                val.store_show = "display:block";
            } else {
                val.show = "display:none";
                val.store_show = "display:none";
            }
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else {
                val.phone_show = "display:none";
                val.show = "display:none";
            }
        } else {
            val.store_name = mall_name;
            val.store_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
            val.store_show = "display:none";
            val.phone_show = "display:none";
            val.show = "display:none";
        }
        if (val.store_image.indexOf('missing.png') > 0){
            val.store_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
        }

        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        val.published_on = show_date.format("MMM D");
    
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromotions(container, template, collection, centre){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    $.each( collection , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            val.store_show = "display:inline-block";
            val.image_url = val.promo_image_url_abs;
            if (val.promo_image_url_abs.indexOf('missing.png') > 0){
                val.image_url  = store_details.store_front_url_abs;
            }
            
            if (store_details.store_front_url_abs.indexOf('missing.png') > 0){
                val.image_url  = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg"
            }
            
            if(val.cat_list != null){
                try {
                    val.cat_list = store_details.categories.join(',')
                }
                catch(err) {
                    console.log(err);
                }
            }
            val.store_slug = "/stores/" + store_details.slug
        } else {
            val.image_url = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
            val.store_name = mall_name;
            val.store_slug = "/"
            val.store_show = "display:none;";
        }

        if (val.description.length > 200){
            val.description_short = val.description.substring(0,200) + "...";
        } else {
            val.description_short = val.description
        }

        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        } else {
        	val.dates = start.format("MMM D") + " - " + end.format("MMM D");
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPromoDetails(container, template, collection, centre){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html); 
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if (val.promotionable_type == "Store") {
            var store_details = getStoreDetailsByID(val.promotionable_id);
            val.store_detail_btn = store_details.slug ;
            val.store_name = store_details.name;
            
            if (store_details.store_front_url_abs.indexOf('missing.png') > 0){
                val.store_image  = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg"
            } else {
                val.store_image = store_details.store_front_url_abs;
            }
            
            val.store_slug = store_details.slug
            val.store_show = "display:block";
            if (store_details.website != null && store_details.website.length > 0){
                val.show = "display:block";
                val.website = store_details.website
            } else {
                val.show = "display:none";
            }
            
            if (store_details.phone != null && store_details.phone.length > 0){
                val.phone_show = "display:block";
                val.phone = store_details.phone
            } else {
                val.phone_show = "display:none";
            }
        } else {
            val.store_name = mall_name;
            val.store_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
            val.store_show = "display:none";
            val.phone_show = "display:none";
            val.show = "display:none";
        }
        val.image_url = val.promo_image_url_abs
        if(val.image_url.indexOf('missing.png') > 0){
            val.image_url  = "//codecloud.cdn.speedyrails.net/sites/56c740936e6f642d56000000/image/png/1456246178000/promo_image.png";
        }
        if(val.promo_image_url_abs.indexOf('missing.png') > -1){
            val.promo_image_show="display:none";
        }

        var show_date = moment(val.show_on_web_date).tz(getPropertyTimeZone());
        var start = moment(val.start_date).tz(getPropertyTimeZone());
        var end = moment(val.end_date).tz(getPropertyTimeZone());
        if (start.format("DMY") == end.format("DMY")){
        	val.dates = start.format("MMM D");
        } else {
        	val.dates = start.format("MMM D") + " - " + end.format("MMM D");
        }
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderPosts(container, template, collection){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    var counter = 1;
    Mustache.parse(template_html);   // optional, speeds up future uses
    $.each( collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/png/1507232968000/Group 10.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 175){
            val.description_short = val.body.substring(0, 175) + "...";
        } else {
            val.description_short = val.body;
        }
        val.description_short = val.description_short.replace("&amp;", "&");
        
        val.slug = "posts/" + val.slug;
        
        val.twitter_title = val.title + " via @DevonshireMall";
        
        val.counter = counter;
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
        counter = counter + 1;
    });
    $(container).html(item_rendered.join(''));
}

function renderPostDetails(container, template, collection, blog_posts){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    $.each(collection , function( key, val ) {
        if (val.image_url.indexOf('missing.png') > -1) {
            val.post_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/png/1507232968000/Group 10.png";
        } else {
            val.post_image = val.image_url;
        }
        
        if(val.body.length > 100){
            val.description_short = val.body.substring(0,100) + "...";
        } else {
            val.description_short = val.body;
        }

        var blog_list = [];
        $.each(blog_posts, function(key, val) {
            var slug = val.slug;
            blog_list.push(val.slug);
        });
        var current_slug = val.slug;
        var index = blog_list.indexOf(current_slug);
        if(index >= 0 && index < blog_list.length){
            var next_slug = blog_list[index + 1];
            if(next_slug != undefined || next_slug != null){
                val.next_post = "/posts/" + next_slug;
                val.next_show = "display: block";
            } else {
                val.next_show = "display: none";
            }
        }
        if(index >= 0 && index < blog_list.length){
            var prev_slug = blog_list[index - 1];
            if(prev_slug != undefined || prev_slug != null){
                val.prev_post = "/posts/" + prev_slug;
                val.prev_show = "display: block";
            } else {
                val.prev_show = "display: none";
            }
        }

        val.twitter_title = val.title + " via @DevonshireMall";
        
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}

function renderSinglePost(container, template, main_post){
    var item_list = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses

    if (main_post.image_url.indexOf('missing.png') > 0) {
        main_post.post_image = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
    } else {
        main_post.post_image = main_post.image_url;
    }
        
    if(main_post.body.length > 189){
        main_post.description_short = main_post.body.substring(0, 189) + "...";
    } else{
        main_post.description_short = main_post.body;
    }
    main_post.description_short = main_post.description_short.replace("&amp;", "&");
    
    main_post.slug = "posts/" + main_post.slug;
    
    main_post.twitter_title = main_post.title + " via @DevonshireMall";
    
    var rendered = Mustache.render(template_html, main_post);
    item_list.push(rendered);
    $(container).html(item_list.join(''));
}

function renderStoreList(container, template, collection, starter, breaker){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    var store_initial="";
    $.each( collection , function( key, val ) {
        if(!val.store_front_url ||  val.store_front_url.indexOf('missing.png') > -1 || val.store_front_url.length === 0){
            val.alt_store_front_url = "";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url);    
        }
        
        if(val.categories != null){
            try {
                val.cat_list = val.categories.join(',');
            } catch(err) {
                console.log(err);
            }
        }
        
        var current_initial = val.name[0];
        if(store_initial.toLowerCase() == current_initial.toLowerCase()){
            val.initial = "";
            val.show = "display:none;";
        } else {
            val.initial = current_initial;
            store_initial = current_initial;
            val.show = "display:block;";
        }
        
        if (val.promotions != null){
            val.promotion_exist = "display:inline-block";
        } else {
            val.promotion_exist = "display:none";
        }
        
        if (val.jobs != null){
            val.job_exist = "display:inline-block";
        } else {
            val.job_exist = "display:none";
        }
        
        val.block = current_initial + '-block';
        var rendered = Mustache.render(template_html,val);
        var upper_current_initial = current_initial.toUpperCase();
        if (upper_current_initial.charCodeAt(0) <= breaker.charCodeAt(0) && upper_current_initial.charCodeAt(0) >= starter.charCodeAt(0)){
            item_rendered.push(rendered);
        }
    });
    $(container).html(item_rendered.join(''));
}

function renderStoreDetails(container, template, collection, slug){
    var item_list = [];
    var item_rendered = [];
    var template_html = $(template).html();
    Mustache.parse(template_html);   // optional, speeds up future uses
    item_list.push(collection);
    $.each( item_list , function( key, val ) {
        if ((val.store_front_url).indexOf('missing.png') > -1){
            val.alt_store_front_url = "//codecloud.cdn.speedyrails.net/sites/59c082786e6f6462ee1d0000/image/jpeg/1506715414000/devonshire_default.jpg";
        } else {
            val.alt_store_front_url = getImageURL(val.store_front_url); 
        }
        
        if (val.website != null && val.website.length > 0){
            val.show = "display:block";
        } else {
            val.show = "display:none";
        }
        
        if (val.phone != null && val.phone.length > 0){
            val.phone_show = "display:block";
        } else {
            val.phone_show = "display:none";
        }
        
        if (val.twitter != null && val.twitter.length > 0){
            val.twitter_show = "display:inline-block";
        } else {
            val.twitter_show = "display:none";
        }
        
        if ((val.twitter == null || val.twitter == "") && (val.facebook == "" || val.facebook == null)){
            val.hide_social = "display:none;";
        }
        
        if (val.facebook != null && val.facebook.length > 0){
            val.facebook_show = "display:inline-block";
        } else {
            val.facebook_show = "display:none";
        }
        
        val.map_x_coordinate = val.x_coordinate - 19;
        val.map_y_coordinate = val.y_coordinate - 58;
        var rendered = Mustache.render(template_html,val);
        item_rendered.push(rendered);
    });
    $(container).html(item_rendered.join(''));
}