var isToggle;
var userId;
var sessionId;
var nameValue;
var url;
var orderHeight;
var loginv;
var checkout;
var authenticatedServices = [];
var clickServicesList = [];
var servicesData = [];
var dict = [];
const services = ["badoo", "tinder", "okcupid"];
const swipes = localStorage.getItem("swipes");
var selectedService;
var seenTutorial;
var redShadowValues = "rgb(227 25 25) 0px 0px 20px";
const EXTERNAL_API = "https://localhost:44345"; //"https://api.autolovers.com";
const TUTORIAL_ONE = "First, Log into the dating apps you wish to automate & click on them to add it to your cart!";
const TUTORIAL_TWO = "Then choose the ammount & duration, or remove and start over!";
const TUTORIAL_THREE = "Finally, choose a payment method & fill out all the required fields. Enjoy!";
const TUTORIAL_INTRO = "Welcome to our quick 3 step tutorial, let's begin!";

(function setServicesArray() {

    for (let val of services) {
        dict[val] = {
            counter: 0,
            totalSwipes: 0,
            totalPrice: 0,
            swipes: 0,
            repeat: 0
        }
    }
    servicesData.push(dict)
    dict["totalPayment"] = 0;
})();

var giveValue = function(myKey) {
    return dict[myKey];
};
$(document).ready(function() {
    if (seenTutorial == "False") {
        StartTutorial();
    }
})

function slowScroll(id, minus) {
    $('html,body').animate({
            scrollTop: $(id).offset().top - minus
        },
        'slow');
}

function StartTutorial() {
    windowsize = $(window).width();
    $('.services-wrapper').css('z-index', '1');
    $('.order-wrapper').css('z-index', '-2');
    $('.checkout-wrapper').css('z-index', '-2');
    $('.service').css('z-index', '-2');
    $('.services-wrapper').prepend('<div class="grid-boxes tutorial-box-1 tutorial-box"><h1 class="tutorial-text">' + TUTORIAL_INTRO + '</h1><div class="arrow"></div></div><div class="dim"></div>')

    $('.arrow').on('click', function() {
        $('.arrow').unbind('click');
        $('.service').css('z-index', '1');
        $('.services-wrapper').css('z-index', '1');
        $('.dim').remove();
        $('.tutorial-text').html(TUTORIAL_ONE);
        $('.services-wrapper').addClass('tutorial');
        //$('.main-wrapper-checkout').prepend('<div class="grid-boxes tutorial-box"><h1 class="tutorial-text">' + TUTORIAL_ONE + '</h1><div class="arrow"></div></div>')

        $('.arrow').on('click', function() {
            windowsize = $(window).width();
            $('.order-wrapper').prepend('<div class="grid-boxes tutorial-box-2 tutorial-box"><h1 class="tutorial-text-2">' + TUTORIAL_TWO + '</h1><div class="arrow"></div></div>')
            if (windowsize < 1400) {

                slowScroll(".tutorial-box-2", 80);

            } else if (windowsize < 1100) {
                slowScroll(".tutorial-box-2", 0);
            }
            $('.arrow').unbind('click');
            console.log('clicked arrow');
            $('.services-wrapper').css('z-index', '-2');
            $('.order-wrapper').css('z-index', '1');
            $('.services-wrapper').removeClass('tutorial');
            $('.tutorial-box-1').fadeOut("slow", function() {
                $(this).remove();
            });

            $('.order-wrapper').addClass('tutorial');

            $('.arrow').on('click', function() {
                windowsize = $(window).width();
                $('.checkout-wrapper').prepend('<div class="grid-boxes tutorial-box-3 tutorial-box"><h1 class="tutorial-text-3">' + TUTORIAL_THREE + '</h1><div class="arrow"></div></div>')
                if (windowsize < 1400) {
                    slowScroll(".tutorial-box-3", 0);
                    var currentHeight = 415;
                    var boxHeight = 980;
                    var calculatedHeight = orderHeight - currentHeight;
                    var height = boxHeight + calculatedHeight;
                    $('.tutorial-box-3').css("top", height)

                }
                if (windowsize < 1100) {
                    var currentHeight = 415;
                    var boxHeight = 1821;
                    var calculatedHeight = orderHeight - currentHeight;
                    var height = boxHeight + calculatedHeight;
                    $('.tutorial-box-3').css("top", height)
                }
                $('.arrow').unbind('click');
                console.log('clicked arrow 2');


                $('.order-wrapper').css('z-index', '-3');
                $('.checkout-wrapper').css('z-index', '2');
                $('.order-wrapper').removeClass('tutorial');
                $('.tutorial-box-2').fadeOut("slow", function() {
                    $(this).remove();
                });

                $('.checkout-wrapper').addClass('tutorial');

                $('.arrow').on('click', function() {
                    windowsize = $(window).width();
                    console.log('clicked arrow 3');

                    $('.checkout-wrapper').removeClass('tutorial');
                    $('.tutorial-box-3').fadeOut("slow", function() {
                        $(this).remove();
                    });
                    $('.services-wrapper').css('z-index', '99');
                    $('.order-wrapper').css('z-index', '99');
                    $('.checkout-wrapper').css('z-index', '99');
                    $('.order-wrapper').css('z-index', '1');
                    $.ajax({
                        type: "POST",
                        xhrFields: { withCredentials: true },
                        url: EXTERNAL_API + '/user/tutorial',
                        contentType: "application/json",
                        data: JSON.stringify({
                            SeenTutorial: true,
                        }),
                        success: function(response) {
                            document.cookie = "tutorial=True";

                        },
                        error: function(error) {

                        }
                    });
                })

            })
        })
    })

}

function removeA(arr) {
    var what, a = arguments,
        L = a.length,
        ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax = arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

function removeService(serviceName) {
    removeA(clickServicesList, serviceName);
    serviceValues = giveValue(serviceName);
    var totalpay = parseFloat(dict["totalPayment"]) - parseFloat(serviceValues.totalPrice);

    $('.total-payment-text').empty();
    $('.total-payment-text').append(Math.round((totalpay + Number.EPSILON) * 100) / 100 + " $");
    dict["totalPayment"] = totalpay;

    var selector = document.querySelector('.add-more-wrapper-' + serviceName);

    $('.service-wrapper-' + serviceName).css('box-shadow', 'none');
    $('.error-' + serviceName).remove();
    selector.remove();
    serviceValues.counter = 0;
    serviceValues.totalSwipes = 0;
    serviceValues.totalPrice = 0;
    orderHeight = $('.order-wrapper').height();
}
$(document).ready(function() {

    $('.service ').on('click', function(e) {
        $('.service').css('border', 'none');

    });

    var totalPayment = 0;
    const container = document.querySelector('.main-wrapper-checkout');


    // add service
    try {
        container.addEventListener('click', function(e) {
            var val = e.target.classList[0];
            if (val) {
                var k;
                for (const key of services) {
                    var name = val.split('-')[1]
                    if (name == key) {
                        k = name;
                    }
                }
                if (name == k && k && !e.target.classList.contains('buttonDisabled')) {
                    var str = e.target.classList[0];
                    serviceName = str.substring(str.indexOf("-") + 1);
                    var containsService = clickServicesList.includes(serviceName);

                    if (!(containsService)) {

                        clickServicesList.push(serviceName);
                        console.log(clickServicesList)
                        dict[serviceName].swipes = swipes;
                        if (swipes) {
                            var price = priceGenerator(swipes);
                            serviceValues = giveValue(serviceName);

                            dict[serviceName].totalSwipes = parseFloat(serviceValues.totalSwipes) + parseFloat(serviceValues.swipes);
                            dict[serviceName].totalPrice = parseFloat(price);

                            dict["totalPayment"] = parseFloat(dict.totalPayment) + parseFloat(price);

                            totalPayment = giveValue("totalPayment");
                            serviceValues = giveValue(serviceName);


                            var selected = $("#swipes-dropdown option:selected").text();
                            if (swipes == 500) {
                                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\" selected>500 a day</option><option value=\"1500\">1500 day</option> <option value=\"2000\">2000 a day</option><option value=\"2500\">2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

                            } else if (swipes == 1500) {
                                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\">500 a day</option><option value=\"1500\" selected>1500 day</option> <option value=\"2000\">2000 a day</option><option value=\"2500\">2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

                            } else if (swipes == 2000) {
                                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\">500 a day</option><option value=\"1500\">1500 day</option> <option value=\"2000\" selected>2000 a day</option><option value=\"2500\">2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

                            } else if (swipes == 2500) {
                                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\">500 a day</option><option value=\"1500\">1500 day</option> <option value=\"2000\">2000 a day</option><option value=\"2500\"selected>2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

                            }
                            console.log("ot :" + selected)
                            $('.total-payment-text').empty();
                            $('.total-payment-text').append(Math.round((totalPayment) * 100) / 100 + " $");

                            orderHeight = $('.order-wrapper').height();
                            console.log(orderHeight)
                            serviceValues.counter++;
                        }
                    }
                } else {
                    container.removeEventListener('click', e);
                }
            }
        });
    } catch (error) {

    }

    try {


        container.addEventListener('change', function(e) {
            var str = e.target.classList[1];
            if (str == "repeat") {
                dict["totalPayment"] = 0;
                var swipesSelected = e.target.parentNode.children[1].value;

                str = e.target.classList[0];
                serviceName = str.substring(str.indexOf("-") + 1);
                var selected = $('.repeat-' + serviceName).find(":selected").val();
                var price = priceGenerator(swipesSelected);
                dict[serviceName].totalPrice = price * parseInt(selected);
                var priceTotal = dict[serviceName].totalPrice;
                var servicesValues = Object.values(servicesData[0]);
                for (let index = 0; index < servicesValues.length - 1; index++) {
                    if (servicesValues[index].totalSwipes > 0) {
                        var value = servicesValues[index].totalPrice;
                        dict["totalPayment"] = parseFloat(dict["totalPayment"]) + parseFloat(value)
                    }
                }
                e.target.parentNode.children[2].innerText = priceTotal + " $";
                totalPayment = giveValue("totalPayment");
                $('.total-payment-text').empty();
                $('.total-payment-text').append(Math.round((totalPayment) * 100) / 100 + " $");
                dict[serviceName].repeat = selected;
            } else {
                serviceName = str.substring(0, str.indexOf("-"));
                clickServicesList.push(serviceName);

                dict[serviceName].swipes = swipes;
                var swipesSelected = e.target.parentNode.children[1].value;
                if (swipesSelected) {
                    var price = priceGenerator(swipesSelected);

                    serviceValues = giveValue(serviceName);

                    dict[serviceName].totalSwipes = swipesSelected;
                    if (dict[serviceName].repeat !== 0) {
                        dict[serviceName].totalPrice = dict[serviceName].repeat * price;
                    } else {
                        dict[serviceName].totalPrice = price;
                    }

                    var servicesNames = Object.getOwnPropertyNames(servicesData[0])
                    var servicesValues = Object.values(servicesData[0])

                    dict["totalPayment"] = 0;

                    for (let index = 0; index < servicesValues.length - 1; index++) {
                        if (servicesValues[index].totalSwipes > 0) {
                            var value = servicesValues[index].totalPrice;
                            dict["totalPayment"] = parseFloat(dict["totalPayment"]) + parseFloat(value)
                        }
                    }

                    totalPayment = giveValue("totalPayment");
                    serviceValues = giveValue(serviceName);
                    //$(".payment-section-items").empty();
                    var currentNode = e.target.parentNode.children[2];
                    $(".okcupid-dropdown option[value='2000']").attr("selected", "selected");

                    currentNode.innerText = Math.round((serviceValues.totalPrice) * 100) / 100 + "$"

                    var selected = $("#swipes-dropdown option:selected").text();
                    console.log("ot :" + selected)
                    $('.total-payment-text').empty();
                    $('.total-payment-text').append(Math.round((totalPayment) * 100) / 100 + " $");
                }
            }
        })
    } catch (error) {

    }



    //REMOVE ELEMENTS

    try {


        container.addEventListener('click', function(e) {

            var services = ["service-remove", "okcupid-remove"]
            var k;
            // But only alert for elements that have an alert-button class
            for (const key of services) {

                if (e.target.classList.contains(key)) {

                    k = key;
                }
            }
            var str = e.target.classList[1];
            try {

                serviceName = str.split('-')[0]
            } catch (error) {

            }

            if (e.target.classList.contains(str) && k) {

                removeService(serviceName);
            }
        });

    } catch (error) {

    }
    try {


        container.addEventListener('click', function(e) {
            var str = e.target.classList[0];
            if (str) {


                serviceName = str.split('-')[1]
                if (e.target.classList.contains('addmore-' + serviceName)) {
                    var swipes = localStorage.getItem("swipes");

                    var price = priceGenerator(swipes);

                    serviceValues = giveValue(serviceName);

                    dict[serviceName].totalSwipes = parseFloat(serviceValues.totalSwipes) + parseFloat(swipes);
                    dict[serviceName].totalPrice = parseFloat(serviceValues.totalPrice) + parseFloat(price);

                    dict["totalPayment"] = parseFloat(dict.totalPayment) + parseFloat(price);

                    totalPayment = giveValue("totalPayment");
                    serviceValues = giveValue(serviceName);

                    $(".item-" + serviceName + "").empty();
                    $(".item-" + serviceName + "").append("<img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown\"><option value=\"500\">500 likes a day</option><option value=\"1500\">1500 likes day</option> <option value=\"2000\">2000 likes a day</option><option value=\"2500\">2500 likes a day</option></select><h3 class=\"service-price\"> " + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3> <p class=\"service-remove " + serviceName + "-remove\"> X</p>");

                    $('.total-payment-text').empty();
                    $('.total-payment-text').append(Math.round((totalPayment) * 100) / 100 + " $");

                } else {
                    container.removeEventListener('click', e);
                }
            }
        });
    } catch (error) {

    }
});
$(document).ready(function() {
    $('.btn-login-service').on('click', function(e) {
        var str = this.classList[2];
        console.log("this " + str)
        serviceName = str.split('-')[1]
        loginToService(serviceName, this);
    });
});
$(document).ready(function() {
    $('.register-text').on('click', function() {
        registerToWebsite();
    });
});

function priceGenerator(totalSwipes) {
    switch (totalSwipes) {
        case '500':
            return 2.99;
        case '1500':
            return 3.99;
        case '2000':
            return 4.99;
        case '2500':
            return 5.99;
        default:
            return 0;
    }
}

function planGenerator(likes) {
    switch (likes) {
        case 500:
            return 1;
        case 1500:
            return 2;
        case 2000:
            return 3;
        case 2500:
            return 4;
        default:
            return 0;
    }
}


(function check() {
    url = window.location.href;
    loginv = window.location.href.indexOf("login")
    checkout = window.location.href.indexOf("checkOut")
    dashboard = window.location.href.indexOf("dashboard")
    nameValue = readCookie('username');
    if (nameValue) {
        nameValue = nameValue.split('%')[0];
    }
    seenTutorial = readCookie('tutorial');

    //no session exist for user
    if (!nameValue) {
        // setLoggedInState();
        if (loginv < -1) {

        } else if (checkout > -1 && loginv == -1) {

            location.href = "/index.html";
        }
        //dashboard without a session
        else if (dashboard > -1) {
            location.href = "/index.html";
        }
    }
    //session exists
    if (!(!nameValue)) {
        if (loginv > -1) {
            location.href = "/index.html";
        }
    }

})();

var dataList = {
    Service: 0,

}
var allServices = {
    0: "badoo",
    1: "tinder",
    2: "okcupid"
};


$(document).ready(function() {
    if (checkout > -1) {
        // var str = e.target.classList[0];
        serviceName = "badoo";
        dict[serviceName].swipes = swipes;
        if (swipes) {
            clickServicesList.push(serviceName);
            var price = priceGenerator(swipes);
            serviceValues = giveValue(serviceName);
            //   var val =  $(e.target).children(":selected")[0].value;
            dict[serviceName].totalSwipes = parseFloat(serviceValues.swipes);
            dict[serviceName].totalPrice = parseFloat(price);

            dict["totalPayment"] = parseFloat(dict.totalPayment) + parseFloat(price);

            totalPayment = giveValue("totalPayment");
            serviceValues = giveValue(serviceName);
            if (swipes == 500) {
                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\" selected>500 a day</option><option value=\"1500\">1500 day</option> <option value=\"2000\">2000 a day</option><option value=\"2500\">2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

            } else if (swipes == 1500) {
                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\">500 a day</option><option value=\"1500\" selected>1500 day</option> <option value=\"2000\">2000 a day</option><option value=\"2500\">2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

            } else if (swipes == 2000) {
                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\">500 a day</option><option value=\"1500\">1500 day</option> <option value=\"2000\" selected>2000 a day</option><option value=\"2500\">2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

            } else if (swipes == 2500) {
                $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"><select name=\"swipes\" class=\"swipes-dropdown " + serviceName + "-dropdown\"><option value=\"500\">500 a day</option><option value=\"1500\">1500 day</option> <option value=\"2000\">2000 a day</option><option value=\"2500\"selected>2500 a day</option></select><h3 class=\"service-price\">" + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3><p class=\"service-remove " + serviceName + "-remove\"> X</p><h3 class=\"for-text\"> for </h3><select class=\"repeat-" + serviceName + " repeat\"> <option value=\"1\">1 day</option> <option value=\"2\">2 days</option> <option value=\"3\">3 days</option> <option value=\"4\">4 days</option> <option value=\"5\">5 days</option> <option value=\"6\">6 days</option> <option value=\"7\">1 week</option></select></div></div>");

            }
            $('.total-payment-text').empty();
            $(".total-payment-text").text(Math.round((totalPayment) * 100) / 100 + " $");
            orderHeight = $('.order-wrapper').height();
            console.log(orderHeight)
        }
    }
    if (!(!nameValue)) {

        if (dashboard > -1) {
            $('.service').hide();
            $('.authenticated-service').hide();
            $('.uname').text(nameValue);
            $('.inner-service').append('<div class="loader"></div>');
            $('.interface-container').append('<div style="margin-top: 150px;" class="loader"></div>');
            //  $('.btn-login-service').hide();
            // $('.service-credentials').hide();
            $.ajax({
                type: "GET",
                xhrFields: { withCredentials: true },
                url: EXTERNAL_API + '/services/authServices',
                dataType: 'JSON',
                success: async function(response) {
                    await response.forEach(element => {
                        getAndSetProfileImage(element.service);
                        getUserInfo();
                        $('.loader').remove();
                        for (let [key, value] of Object.entries(allServices)) {
                            if (response[key] != undefined && response[key].service == key) {
                                key = parseInt(key);
                                if (response[key].service == key) {
                                    authenticatedServices.push(value);
                                    $('.imgwrapper-' + value).prepend('<img src="/media/checkmark.png" class="valid"/>');
                                }
                            }
                        }
                        if (authenticatedServices.length == 0) {
                            getUserInfo();
                            $('.loader').remove();
                        }
                    });

                },
                error: function(error) {
                    getUserInfo();
                    $('.loader').remove();
                }
            });
        }
        authenticatedServices.forEach(element => {
            $('.imgwrapper-' + element).prepend('<img src="/media/checkmark.png" class="valid"/>');
        });

    }
});

async function getAndSetProfileImage(service) {
    $.ajax({
        type: "POST",
        xhrFields: { withCredentials: true },
        url: EXTERNAL_API + '/actions/getImages',
        contentType: "application/json",
        data: JSON.stringify({
            Service: service
        }),
        success: function(response) {
            $.each(response, function(k, v) {
                $(".profile-picture").attr("src", v);
                return false;
            });

        },
        error: function(error) {
            console.log(error)
        }
    });
}

async function getUserInfo() {
    $.ajax({
        type: "GET",
        xhrFields: { withCredentials: true },
        url: EXTERNAL_API + '/user/info',
        contentType: "application/json",
        success: function(response) {
            $('#username').html(response.name + ', ');
            $('#age').html(response.age);
            $('.about-me-text').html(response.about);
        },
        error: function(error) {
            $('#username').html(nameValue);
            $('#username').css("width", "45px");
            $('#age').html();
        }
    });
}


$(document).ready(function() {
    const servicesContaienr = document.querySelector('.services-multiple');
    const serviceContaienr = document.querySelector('.interface-box');

    try {



        servicesContaienr.addEventListener('click', function(e) {
            $('.pictures-container').empty();
            $('.pictures-container').removeClass('pictures');
            $('.error-service-login').remove();
            $('.authenticated-service').hide();
            $('.service').hide();
            $('.inner-service').remove();
            var str = e.target.classList[1];
            serviceName = str.substring(str.indexOf("-") + 1);

            $('.error-' + serviceName).remove();
            if (services.includes(serviceName)) {

                if (authenticatedServices.includes(serviceName)) {
                    $('.pictures-container').addClass('pictures-' + serviceName);
                    selectedService = serviceName;
                    var service = parseInt(getKeyByValue(allServices, selectedService));

                    //get images
                    $.ajax({
                        type: "POST",
                        xhrFields: { withCredentials: true },
                        url: EXTERNAL_API + '/actions/getImages',
                        contentType: "application/json",
                        data: JSON.stringify({
                            Service: service
                        }),
                        success: function(response) {
                            if (serviceName == "badoo") {
                                $('.imgwrapper-' + serviceName).css("box-shadow", "0 0 20px #783af9");
                            } else if (serviceName == "tinder") {
                                $('.imgwrapper-' + serviceName).css("box-shadow", "0 0 20px #f747b9");
                            } else if (serviceName == "okcupid") {
                                $('.imgwrapper-' + serviceName).css("box-shadow", "0 0 20px #f14c74");
                            }

                            $('.pictures-container').append('<div style="margin-right: 5px;cursor: pointer;" class="arrow-left"><div class="arrow-one" style=" width: 15px;border: 2px solid #FFFFFF;box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);transform: matrix(-0.65, 0.73, -0.79, -0.64, 0, 0);"></div><div class="arrow-two" style="width: 15px;border: 2px solid #FFFFFF;box-shadow: 0px 4px 4px rgb(0 0 0 / 25%);transform: matrix(0.62, 0.76, -0.82, 0.61, 0, 7);"></div></div>')
                            $.each(response, function(k, v) {
                                $('.pictures-container').append('<div class="picture-box" data-id=' + k + '><div class="trash-box"style="position: absolute;"><img src="/media/trash.png" alt="" class="trash-icon"></div><img class="picture-src" src="' + v + '" alt="picture"/></div>');

                            });
                        },
                        error: function(error) {

                        }
                    });
                    //get about me


                    $('.authenticated-service').show();

                } else {
                    //$('.loader').hide();
                    // $('.service').prepend('<div class="inner-service"><img class="service-img " alt=" " src="/media/' + serviceName + '.png "> <div ></div><div class=\"service-credentials service-credentials-' + serviceName + '\"> <p class=\"username-service\">Username</p> <input maxlength=\"50\" type=\"email\" class=\"text-box-service-email \" /> <div class=\"break\"></div> <p class=\"password-service\">Password</p> <input maxlength=\"50\" type=\"password\" class=\"text-box-service-password\" /> <div class=\"break\"></div> </div> <div class=\"btn btn-login-service login-' + serviceName + ' disable-select\"> <p class=\"login-text-service\" onclick=\"\">Login</p> </div></div>')
                    //$('.service').show();

                    location.href = "/checkOut.html";

                    /* $('.service').on('click', function(e) {
                        $('.error-service-login').remove();
                        if (e.target.parentNode.classList[2] == 'login-' + serviceName) {
                            if (services.includes(serviceName)) {

                                loginToService(serviceName, e.currentTarget.children[0].children[3]);
                            }
                        }

                    }); */
                }
            }
        });
    } catch (error) {

    }
    try {

        servicesContaienr.addEventListener('click', function(e) {
            $('.error-service-login').remove();
            if (e.target.parentNode.classList[2] == 'login-' + serviceName) {
                if (services.includes(serviceName)) {

                    loginToService(serviceName, e.currentTarget.children[0].children[3]);
                }
            }
        });
    } catch (error) {

    }
    var oldAbout;
    try {

        serviceContaienr.addEventListener('click', function(e) {
            $('.error-service-login').remove();
            if (e.target.parentNode.classList[0] == 'about-me') {
                oldAbout = $('.about-me-text').text();
                $('.about-me-text').hide();
                $('.update-btn-about-me').hide();

                $('.about-wrapper').append('<textarea maxlength="500" class="about-me-text-box"></textarea><p class="cancel">x</p><div class="update-btn"><p class="update-btn-text">Update</p></div>');

            }
        });
    } catch (error) {

    }
    try {

        serviceContaienr.addEventListener('click', function(e) {
            $('.error-service-login').remove();
            if (e.target.classList[0] == 'cancel') {
                $('.cancel').remove();
                $('.update-btn').remove();
                $('.update-btn-text').remove();
                $('.about-me-text-box').remove();
                $('.about-me-text').show();
                $(".about-me-text").html(oldAbout);
                $('.update-btn-about-me').show();
            }
        });
    } catch (error) {

    }

    try {

        serviceContaienr.addEventListener('click', function(e) {
            $('.error-service-login').remove();
            if (e.target.parentNode.classList[0] == 'update-btn') {
                $('.about-me').prepend('<div class="loader" style="position: absolute; top:700px;margin-left: 60px;"></div>');

                var about = $(".about-me-text-box").val();
                var service = parseInt(getKeyByValue(allServices, selectedService));

                $.ajax({
                    type: "POST",
                    xhrFields: { withCredentials: true },
                    url: EXTERNAL_API + '/actions/updateAbout',
                    contentType: "application/json",
                    data: JSON.stringify({
                        About: about,
                        Service: service
                    }),
                    success: function(response) {
                        console.log(response)
                        $('.cancel').remove();
                        $('.loader').remove();
                        $('.update-btn').remove();
                        $('.update-btn-text').remove();
                        $('.about-me-text-box').remove();
                        $('.about-me-text').show();
                        $(".about-me-text").html(response.about);
                        $('.update-btn-about-me').show();
                    },
                    error: function(error) {
                        $('.cancel').remove();
                        $('.loader').remove();
                        $('.update-btn').remove();
                        $('.update-btn-text').remove();
                        $('.about-me-text-box').remove();
                        $('.about-me-text').show();
                        $(".about-me-text").html(oldAbout);
                        $('.update-btn-about-me').show();
                    }
                });
            }
        });
    } catch (error) {

    }
    try {
        serviceContaienr.addEventListener('click', function(e) {
            $('.error-service-login').remove();
            if (e.target.classList[0] == 'add-picture') {
                e.preventDefault();
                $("#avatar").trigger('click');
                var file_data = $("#avatar").prop("files")[0];
                var file = new FormData();

            }
        });

    } catch (error) {

    }

    $(document).on('change', '#avatar', function(e) {
        var file_data = $("#avatar").prop("files")[0];
        var file = new FormData();
        var service = parseInt(getKeyByValue(allServices, selectedService));
        file.append("file", file_data);
        file.append("data", service)

        $.ajax({
            xhrFields: { withCredentials: true },
            url: EXTERNAL_API + '/actions/uploadImage',
            type: "POST",
            dataType: 'json',
            data: file,
            processData: false,
            contentType: false,
            success: function(response) {
                $.each(response, function(k, v) {
                    $('.pictures-container').append('<div class="picture-box" data-id=' + k + '><div class="trash-box"style="position: absolute;"><img src="/media/trash.png" alt="" class="trash-icon"></div><img class="picture-src" src="' + v + '" alt="picture"/></div>');
                    console.log(k)
                    console.log(v)
                });
            },
            error: function(error) {
                console.log(error)
            },
        })
    });

});

$(document).ready(function() {


    $('.interface-box').on('click', '.trash-box', function(e) {

        var dataId = this.parentNode.attributes[1].value;
        var url = this.parentNode.parentNode.classList[1];
        var serviceName = url.split('-')[1];


        $.ajax({
            type: "POST",
            url: EXTERNAL_API + '/actions/removeImage',
            xhrFields: { withCredentials: true },
            contentType: "application/json",
            data: JSON.stringify({
                ImageId: dataId,
                Service: parseInt(getKeyByValue(allServices, serviceName))
            }),
            success: function(response) {

                $('.pictures-container').empty();
                $('#avatar').remove();
                $('.picture-box').append('<input id="avatar" type="file" name="avatar"/>');
                $.each(response, function(k, v) {
                    $('.pictures-container').append('<div class="picture-box" data-id=' + k + '><div class="trash-box"style="position: absolute;"><img src="/media/trash.png" alt="" class="trash-icon"></div><img class="picture-src" src="' + v + '" alt="picture"/></div>');
                    console.log(k)
                    console.log(v)
                });

            },
            error: function(error) {

            }
        });
    });
});


$(document).ready(function() {

    if (!(!nameValue)) {
        if (checkout > -1) {
            $('.uname').text(nameValue);
            $('.credentials-box-wrapper').append('<div class="loader"></div>');
            $('.loader').css('display', 'block');
            //  $('.btn-login-service').hide();
            // $('.service-credentials').hide();
            $.ajax({
                type: "GET",
                xhrFields: { withCredentials: true },
                url: EXTERNAL_API + '/services/authServices',
                dataType: 'JSON',
                success: function(response) {
                    $('.loader').remove();
                    // $('.loader').css('display', 'hidden');
                    //  $('.loader').hide();
                    console.log(response);
                    //services return in int form

                    for (let [key, value] of Object.entries(allServices)) {
                        console.log('AAAAAA' + allServices)
                        console.log('AAAAAA' + value)
                        console.log(key)
                        key = parseInt(key);
                        console.log
                        if (response[key] != undefined && response[key].service == key) {
                            authenticatedServices.push(value);
                            console.log(authenticatedServices);
                            var serviceFactory = new ServiceFactory();
                            res = serviceFactory.create(value);
                            console.log(res);

                            $('.credentials-box-wrapper-' + value).prepend('<div class=\"service-message message-' + value + '\"><p>Start at </p> <input class=\"date-badoo date-service\" type=\"datetime-local\"></div>');
                            $('.date-service').val(new Date().toDateInputValue());
                            $('.date-service').prop('min', function() {
                                return new Date().toDateInputValue();
                            });
                            //For testing uncomment Premium = true
                            //response[key].Premium = true;
                            if (!response[key].Premium) {
                                disableService(value);
                                removeService(value);
                                $('.credentials-box-wrapper-' + value).append('<p style="color:red; pointer-events: auto;">Not enough likes left! please Upgrade on <a style="border-bottom:1px solid black;" href=https://' + value + '.com>badoo.com</a></p>')
                            }
                        } else {
                            if (checkout > -1) {

                                $('.credentials-box-wrapper-' + value).prepend('<div class=\"service-credentials service-credentials-' + value + '\"> <p class=\"username-service\">Username</p> <input maxlength=\"50\" type=\"email\" class=\"text-box-service-email \" /> <div class=\"break\"></div> <p class=\"password-service\">Password</p> <input maxlength=\"50\" type=\"password\" class=\"text-box-service-password\" /> <div class=\"break\"></div> </div> <div class=\"btn btn-login-service login-' + value + ' disable-select\"> <p class=\"login-text-service\" onclick=\"\">Login</p> </div>');
                                $('.credentials-box-wrapper-' + value).show();
                                $('.credentials-box-wrapper-' + value).on('click', function(e) {
                                    console.log(e.target.classList)
                                    if (e.target.parentElement.classList[2] == 'login-' + value) {
                                        loginToService(value, e.currentTarget.children[1]);
                                    }

                                });
                            }
                        }
                    }

                    //$('.loader').remove();
                    //$('.btnName').show();
                    //$('.loader-' + serviceName).prepend('<div class=\"service-message message-badoo\"><p>Start at </p> <input class=\"date-badoo date-service\" type=\"datetime-local\"></div>');
                },
                error: function(error) {
                    $('.loader').remove();
                    $('.btnName').show();
                    $('.service-credentials').show();
                    $('.login-' + serviceName).show();
                    getUserInfo();

                    console.log(error);
                }
            });
        }
    }
});

function disableService(value) {
    $('.service-' + value).addClass('buttonDisabled', 'disable-select');
    $('.service-' + value).css('cursor', 'default');
    $('.service-' + value).css('transform', 'none');
    $('.service-' + value).css('pointer-events', 'none');
    $('.service-wrapper-' + value).addClass('buttonDisabled', 'disable-select');
    $('.date-' + value).prop('disabled', true);
    $('.service-wrapper-' + value).addClass('disabler');
    $('.service-wrapper-' + value).css('cursor', 'default');
    $('.date-' + value).addClass('buttonDisabled', 'disable-select');
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
$(document).ready(function() {
    var ele = document.getElementById(".hamburger");
    var howto = document.querySelector(".how-to");
    var hamburger = document.querySelector(".hamburger");
    var navMenu = document.querySelector(".nav-bar-items");
    var main = document.querySelector(".wrapper");
    var header = document.querySelector(".header");
    var checkout = document.querySelector(".main-wrapper-checkout");

    try {
        hamburger.addEventListener("click", mobileMenu);
    } catch (error) {

    }

    function mobileMenu() {
        isToggle = true;
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        try {
            header.classList.toggle("active");
            main.classList.toggle("active");
            checkout.classList.toggle("active");
            howto.classList.toggle("active");

        } catch (error) {

        }

    }
    const navLink = document.querySelectorAll(".nav-item");

    navLink.forEach(n => n.addEventListener("click", closeMenu));

    function closeMenu() {
        isToggle = false;
        try {
            howto.classList.remove("active");
            checkout.classList.remove("active");
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
            main.classList.remove("active");
            header.classList.remove("active");


        } catch (error) {}
    }
});

$(document).ready(function() {
    if (nameValue) {
        setLoggedInState();
    }
});

function setLoggedInState() {
    windowsize = $(window).width();

    if (nameValue) {

        $(".login").remove();
        $(".signup").remove();

        $(".nav-bar-items").append("<li class=\"dashboard nav-item\"> <a href=\"\/dashboard.html\">Dashboard<\/a> <\/li>");
        if (windowsize < 1100) {
            $("<li class=\"user\"> <a href=\"\/dashboard.html\">Welcome " + nameValue + "!<\/a> <\/li>").insertBefore(".what-we-do");
            $(".nav-bar-items").append("<li class=\"logout\"><a>Logout<\/a><\/li>")
        } else {
            $(".nav-bar-items").append("<li class=\"user\"> <a href=\"\/dashboard.html\">Welcome " + nameValue + "!<\/a><\/li>")
            $(".nav-bar-items").append("<li class=\"logout\"><a>Logout<\/a><\/li>")
        }
        $(".nav-bar-items").css("margin-left", "35%")
        $(".user").css("cursor", "default")
    } else {

        $(".user").remove();
        $(".logout").remove();
        $(".nav-bar-items").append('<li class="login nav-item"><a href="/login.html">Login</a></li>');
        $(".nav-bar-items").append('<li class="signup nav-item"><a href="/login.html">Sign up</a></li>');
        location.href = "/index.html";
    }
}

function Badoo() {
    this.type = "badoo";
    this.html = "<h1>test</h1>"
}

function Tinder() {
    this.type = "tidner";
    this.html = "<h1>test</h1>"
}

function OkCupid() {
    this.type = "okcupid";
    this.html = "<h1>test</h1>"
}

function ServiceFactory() {
    this.create = (type) => {
        switch (type) {
            case "badoo":
                return new Badoo();
            case "tinder":
                return new Tinder();
            case "okcupid":
                return new OkCupid();
            default:
                break;
        }
    };
}



var returnUrl;
$(document).ready(function() {
    $(".500").on('click', function(event) {
        var totalSwipes = $('#500-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!nameValue)) {
            location.href = "/checkOut.html";
        } else {

            location.href = "/login.html?returnUrl=/checkOut.html";
        }
    });
});
$(document).ready(function() {
    $(".1500").on('click', function(event) {
        var totalSwipes = $('#1500-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!nameValue)) {
            location.href = "/checkOut.html";
        } else {

            location.href = "/login.html?returnUrl=/checkOut.html";
        }
    });
});

$(document).ready(function() {
    $(".2000").on('click', function(event) {
        var totalSwipes = $('#2000-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!nameValue)) {
            location.href = "/checkOut.html";
        } else {

            location.href = "/login.html?returnUrl=/checkOut.html";
        }
    });
});

$(document).ready(function() {
    $(".2500").on('click', function(event) {
        var totalSwipes = $('#2500-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!nameValue)) {
            location.href = "/checkOut.html";
        } else {

            location.href = "/login.html?returnUrl=/checkOut.html";
        }
    });
});


function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function deleteCookie(name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};
$(document).ready(function() {
    $('.logout').on('click', function() {
        $.ajax({
            xhrFields: { withCredentials: true },
            type: "POST",
            url: EXTERNAL_API + '/authorize/logout',
            contentType: "application/json",
            success: function(response) {
                nameValue = undefined;
                deleteCookie('username');
                deleteCookie('tutorial');
                setLoggedInState();
            },
            error: function(error) {

            }
        });
    })
});

$(document).ready(function() {
    $(".login-text").on('click', function(event) {
        $('.wrong-credentials').remove();
        var email = $(".text-box-login-email").val()
        var password = $(".text-box-login-password").val()
        $('.login-credentials').hide();

        $('.login-section').append('<div class="loader"></div>');
        // $('.loader').css('display', 'block');

        $.ajax({
            xhrFields: { withCredentials: true },
            type: "POST",
            url: EXTERNAL_API + '/authorize/login',
            data: JSON.stringify({
                UserName: email,
                Password: password
            }),
            contentType: "application/json",
            success: function(response) {
                var newurl = new URL(location.href);
                newurl = newurl.searchParams.get("returnUrl");
                if (!newurl) {
                    setLoggedInState();
                    window.location.href = "/dashboard.html"
                } else {
                    console.log(newurl);
                    location.href = "/" + newurl;
                }

            },
            error: function(error) {
                $('.login-t').append('<p class="wrong-credentials" style="font-weight:normal; font-size: 15px; color:red;">wrong username/password</p>')
                $('.credentials').show();
                $('.loader').remove();
            }
        });
    });
});





function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function loginToService(serviceName, context) {
    $('.error-' + serviceName).remove();
    let password = $('.text-box-service-password').val()
    let username = $('.text-box-service-email').val()
    console.log(username)
    console.log(context)

    data = {
        UserName: username,
        Password: password,
        Service: parseInt(getKeyByValue(allServices, serviceName))
    }

    var btnName = context.classList[2];

    $('.' + btnName).hide();
    $('.credentials-box-wrapper-' + serviceName).append('<div class="loader"></div>');
    $('.loader').css('display', 'block');

    $('.' + context.parentNode.children[0].classList[1]).hide();
    $('.login-' + serviceName).hide();
    $.ajax({
        type: "POST",
        xhrFields: { withCredentials: true },
        url: EXTERNAL_API + '/services/loginToService',
        data: JSON.stringify({
            UserName: data.UserName,
            Password: data.Password,
            Service: data.Service
        }),
        contentType: "application/json",
        success: function(response) {
            var x = response;
            $('.loader').remove();
            $('.btnName').show();

            $('.credentials-box-wrapper-' + serviceName).prepend('<div class=\"service-message message-' + serviceName + '\"><p>Start at </p> <input class=\"date-badoo date-service\" type=\"datetime-local\"></div>');
            $('.date-service').val(new Date().toDateInputValue());
            $('.date-service').prop('min', function() {
                return new Date().toDateInputValue();
            });
            authenticatedServices.push(serviceName);
            if (!response.premium) {
                disableService(serviceName);
                removeService(serviceName);
                $('.credentials-box-wrapper-' + serviceName).append('<p style="color:red; pointer-events: auto;">Not enough likes left! please Upgrade on <a style="border-bottom:1px solid black;" href=https://' + serviceName + '.com>badoo.com</a></p>')
            }
        },
        error: function(error) {
            $('.loader').remove();
            $('.service-credentials-' + serviceName).prepend('<div class="error-service-login error-' + serviceName + '">wrong username/password</div>');
            $('.btnName').show();
            $('.service-credentials').show();
            $('.login-' + serviceName).show();
            console.log(error);
        }
    });
}

function registerToWebsite() {
    $('.wrong-credentials').remove();
    let username = $('.text-box-register-email').val()
    let password = $('.text-box-register-password').val()
    let repeatPassword = $('.text-box-register-repeat').val()
    if (password != repeatPassword) {
        $('.register-t').append('<p class="wrong-credentials" style="font-weight:normal; font-size: 15px; color:red;">Password does not match..</p>')
        console.log('no')
        return;
    }

    $('.register-credentials').hide();
    $('.wrong-credentials').remove();
    $('.register-section').append('<div style="margin-top:72px;margin-bottom:50px;" class="loader"></div>');
    data = {
        UserName: username,
        Password: password,
    }

    $.ajax({
        type: "POST",
        xhrFields: { withCredentials: true },
        url: EXTERNAL_API + '/authorize/register',
        data: JSON.stringify({
            UserName: data.UserName,
            Password: data.Password
        }),

        contentType: "application/json",
        success: function(response) {

            location.href = "/dashboard.html";
        },
        error: function(error) {


            $('.register-t').append('<p class="wrong-credentials" style="font-weight:normal; font-size: 15px; color:red;">Email already taken.</p>')
            $('.register-credentials').show();
            $('.loader').remove();

        }
    });
}


function getImages() {

    data = {
        UserId: userId,
        SessionId: sessionId
    }

    $.ajax({
        type: "POST",
        url: EXTERNAL_API + '/actions/getImages',
        data: JSON.stringify({

            UserId: data.UserId,
            SessionId: data.SessionId
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(response) {
            let res = response;

            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

Date.prototype.toDateInputValue = (function() {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    console.log(local.toJSON().slice(0, 20));
    return local.toJSON().slice(0, 19);
});

$(document).ready(function() {
    $('#date').val(new Date().toDateInputValue());
    $('.date-service').val(new Date().toDateInputValue());

});


$(document).ready(function() {

    $('.btn-submit').on('click', function(e) {
        $('.error-service-login').remove();
        //check if there are any services that have been added to shopping cart but not authorized, if so block sending & prompt for authorization
        var unauhorizedServices = [];
        clickServicesList.forEach(element => {
            if (!authenticatedServices.includes(element)) {
                unauhorizedServices.push(element)
            }
        });
        if (unauhorizedServices.length == 0 && clickServicesList.length > 0) {

            var servicesNames = Object.getOwnPropertyNames(servicesData[0])
            var servicesValues = Object.values(servicesData[0])
            var data = []

            for (let index = 0; index < servicesValues.length - 1; index++) {
                if (authenticatedServices.includes(servicesNames[index + 1])) {
                    if (servicesValues[index].totalSwipes > 0) {

                        const name = servicesNames[index + 1];
                        const value = servicesValues[index].totalSwipes;
                        const repeat = servicesValues[index].repeat;
                        //index is also the services name cuz its an enum
                        data.push({ Service: index, Likes: value, Repeat: repeat, Plan: planGenerator(value) })
                    }
                }
            }
            console.log(data)
            $.ajax({
                type: "POST",
                url: EXTERNAL_API + '/actions/schedule',
                xhrFields: { withCredentials: true },
                data: JSON.stringify(data),
                contentType: 'application/json',
                success: function(response) {
                    location.href = "/dashboard.html";
                },
                error: function(error) {

                }
            });
        } else {
            unauhorizedServices.forEach(element => {

                $('.service-wrapper-' + element).css('box-shadow', redShadowValues);

                $('.service-credentials-' + element).prepend('<div style=position:absolute; class="error-service-login error-' + element + '">Please log into service</div>');

            });
        }
        if (clickServicesList.length == 0) {
            services.forEach(element => {
                $('.service-wrapper-' + element).css('box-shadow', redShadowValues);

            });
        }
    });
});