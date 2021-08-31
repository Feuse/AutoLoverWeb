var isToggle;
var value;
var url;
var loginv;
var checkout;
var clickServicesList = [];
var servicesData = [];
var dict = [];
var services = [];
(function setServicesArray() {

    services = ["badoo", "tinder", "okcupid"];
    for (let val of services) {
        dict[val] = {
            counter: 0,
            totalSwipes: 0,
            totalPrice: 0,
            swipes: 0
        }
    }
    servicesData.push(dict)
    dict["totalPayment"] = 0;


})();

var giveValue = function(myKey) {
    return dict[myKey];
};

$(document).ready(function() {

    $('.service ').on('click', function(e) {
        $('.service').css('border', 'none');

    });

    var totalPayment = 0;

    const container = document.querySelector('.main-wrapper-checkout');
    const swipes = localStorage.getItem("swipes");

    // add service

    container.addEventListener('click', function(e) {
        var services = ['service-img', 'service', 'service-credentials']
        var k;

        for (const key of services) {

            if (e.target.classList.contains(key)) {
                k = key;
            }
        }
        if (e.target.classList.contains(k) && k) {


            var str = e.target.classList[0];
            serviceName = str.substring(str.indexOf("-") + 1);

            if (!clickServicesList.includes(serviceName)) {

                clickServicesList.push(serviceName);
                console.log(clickServicesList)
                dict[serviceName].swipes = swipes;
                if (swipes) {

                    var price = priceGenerator(swipes);

                    serviceValues = giveValue(serviceName);

                    dict[serviceName].totalSwipes = parseFloat(serviceValues.totalSwipes) + parseFloat(serviceValues.swipes);
                    dict[serviceName].totalPrice = parseFloat(serviceValues.totalPrice) + parseFloat(price);

                    dict["totalPayment"] = parseFloat(dict.totalPayment) + parseFloat(price);

                    totalPayment = giveValue("totalPayment");
                    serviceValues = giveValue(serviceName);

                    $('.total-payment-text').empty();
                    $('.total-payment-text').append(Math.round((totalPayment) * 100) / 100 + " $");

                    if (serviceValues.counter == 0) {
                        $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><h1 class=\"addmore-" + serviceName + " addmore style= cursor: pointer;\">+</h1><div class=\"item-" + serviceName + " item\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"> <p class=\"service-swipes\">" + serviceValues.totalSwipes + "</p> <h3 class=\"service-price\"> " + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3> <p class=\"service-remove " + serviceName + "-remove\"> X</p> </div></div>");
                        $(".total-payment-text").text(Math.round((totalPayment) * 100) / 100 + " $");
                    }

                    serviceValues.counter++;
                }
            }
        } else {
            container.removeEventListener('click', e);
        }
    });

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

    //REMOVE ELEMENTS


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

            removeA(clickServicesList, serviceName);

            serviceValues = giveValue(serviceName);
            var totalpay = parseFloat(giveValue("totalPayment")) - parseFloat(serviceValues.totalPrice);
            $('.total-payment-text').empty();
            $('.total-payment-text').append(Math.round((totalpay + Number.EPSILON) * 100) / 100 + " $");
            dict["totalPayment"] = totalpay;

            var selector = document.querySelector('.add-more-wrapper-' + serviceName);

            $('.service-' + serviceName).css('border', 'none');



            selector.remove();
            serviceValues.counter = 0;
            serviceValues.totalSwipes = 0;
            serviceValues.totalPrice = 0;


            container.addEventListener('click', function(e) {
                var services = ['service-img', 'service', 'service-credentials']
                var k;
                // But only alert for elements that have an alert-button class
                for (const key of services) {

                    if (e.target.classList.contains(key)) {
                        k = key;
                    }
                }
                if (e.target.classList.contains(k) && k) {

                    var str = e.target.classList[0];
                    serviceName = str.substring(str.indexOf("-") + 1);
                    dict[serviceName].swipes = swipes;
                    if (swipes) {

                        var price = priceGenerator(swipes);

                        serviceValues = giveValue(serviceName);

                        dict[serviceName].totalSwipes = parseFloat(serviceValues.totalSwipes) + parseFloat(serviceValues.swipes);
                        dict[serviceName].totalPrice = parseFloat(serviceValues.totalPrice) + parseFloat(price);

                        dict["totalPayment"] = parseFloat(dict.totalPayment) + parseFloat(price);

                        totalPayment = giveValue("totalPayment");
                        serviceValues = giveValue(serviceName);

                        $('.total-payment-text').empty();
                        $('.total-payment-text').append(Math.round((totalPayment) * 100) / 100 + " $");
                        if (serviceValues.counter == 0) {
                            $(".payment-section-items").append("<div style=\"margin-top: 30px; margin-bottom: 30px; width: 300px; display: inline-flex; justify-content: space-between; align-items: center;\" class=\"add-more-wrapper add-more-wrapper-" + serviceName + "\"><h1 class=\"addmore-okcupid " + serviceName + "\">+</h1><div class=\"item-" + serviceName + " item\"><img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"> <p class=\"service-swipes\">" + serviceValues.totalSwipes + "</p> <h3 class=\"service-price\"> " + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3> <p class=\"service-remove " + serviceName + "-remove\"> X</p> </div></div>");
                            $(".total-payment-text").text(Math.round((totalPayment) * 100) / 100 + " $");
                        }
                        /* else {
                                       console.log('here')
                                       $(".item-" + serviceName + "").empty();
                                       $(".item-" + serviceName + "").append("<img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"> <p class=\"service-swipes\">" + serviceValues.totalSwipes + "</p> <h3 class=\"service-price\"> " + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3> <p class=\"service-remove " + serviceName + "-remove\"> X</p>");
                                   } */
                        serviceValues.counter++;
                    }
                }
            }, { once: true });
        }
    });


    container.addEventListener('click', function(e) {
        var str = e.target.classList[0];

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
            $(".item-" + serviceName + "").append("<img src=\"/media/" + serviceName + ".png\" alt=\"\" class=\"service-mini-logo\"> <p class=\"service-swipes\">" + serviceValues.totalSwipes + "</p> <h3 class=\"service-price\"> " + Math.round((serviceValues.totalPrice) * 100) / 100 + "$</h3> <p class=\"service-remove " + serviceName + "-remove\"> X</p>");

            $('.total-payment-text').empty();
            $('.total-payment-text').append(Math.round((totalPayment) * 100) / 100 + " $");

        } else {
            container.removeEventListener('click', e);
        }
    });

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
        case '1000':
            return 3.99;
        case '1500':
            return 4.99;
        case '2000':
            return 5.99;
        default:
            return 0;
    }
}


(function check() {
    url = window.location.href;
    loginv = window.location.href.indexOf("login")
    checkout = window.location.href.indexOf("checkOut")
    dashboard = window.location.href.indexOf("dashboard")
    value = readCookie('username');
    if (!(!value)) {
        value = value.split('%')[0];
    }
    //no session exist for user
    if (!value) {
        setLoggedInState();
        if (loginv < -1) {

        } else if (checkout > -1 && loginv == -1) {

            location.href = "https://localhost/index.html";
        }
        //dashboard without a session
        else if (dashboard > -1) {
            location.href = "https://localhost/index.html";
        }
    }
    //session exists
    if (!(!value)) {
        if (loginv > -1) {
            location.href = "https://localhost/index.html";
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
var authenticatedServices = [];
$(document).ready(function() {

    if (!(!value)) {
        if (checkout > -1) {
            $('.uname').text(value);
            $('.credentials-box-wrapper').append('<div class="loader"></div>');
            $('.loader').css('display', 'block');
            //  $('.btn-login-service').hide();
            // $('.service-credentials').hide();
            $.ajax({
                type: "GET",
                xhrFields: { withCredentials: true },
                url: 'https://localhost:44345/api/authServices',
                dataType: 'JSON',
                success: function(response) {
                    $('.loader').remove();
                    // $('.loader').css('display', 'hidden');
                    //  $('.loader').hide();
                    console.log(response);
                    //services return in int form

                    for (let [key, value] of Object.entries(allServices)) {
                        key = parseInt(key);
                        console.log
                        if (response.includes(key)) {
                            authenticatedServices.push(value);
                            console.log(authenticatedServices);
                            var serviceFactory = new ServiceFactory();
                            res = serviceFactory.create(value);
                            console.log(res);

                            //$('.service-credentials-' + res.type).hide();
                            $('.credentials-box-wrapper-' + value).prepend('<div class=\"service-message message-badoo\"><p>Start at </p> <input class=\"date-badoo date-service\" type=\"datetime-local\"></div>');
                            $('.date-service').val(new Date().toDateInputValue());
                            $('.date-service').prop('min', function() {
                                return new Date().toDateInputValue();
                            });
                        } else {
                            $('.credentials-box-wrapper-' + value).prepend('<div class=\"service-credentials service-credentials-' + value + '\"> <p class=\"username-service\">Username</p> <input maxlength=\"50\" type=\"email\" class=\"text-box-service-email \" /> <div class=\"break\"></div> <p class=\"password-service\">Password</p> <input maxlength=\"50\" type=\"password\" class=\"text-box-service-password\" /> <div class=\"break\"></div> </div> <div class=\"btn btn-login-service login-' + value + ' disable-select\"> <p class=\"login-text-service\" onclick=\"\">Login</p> </div>');
                            $('.credentials-box-wrapper-' + value).on('click', function(e) {
                                console.log(e.target.classList)
                                if (e.target.parentElement.classList[2] == 'login-' + value) {

                                    loginToService(value, e.currentTarget.children[1]);
                                }

                            });
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
                    console.log(error);
                }
            });
        }
    }
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

$(document).ready(function() {
    if (!(!value)) {
        setLoggedInState();
    }
});

function setLoggedInState() {
    $(".login").remove();
    $(".signup").remove();
    $(".nav-bar-items").append("<li class=\"dashboard nav-item\"> <a href=\"\/dashboard.html\">Dashboard<\/a> <\/li>");
    if (isToggle) {
        $("<li class=\"user\"> <a href=\"\/dashboard.html\">Welcome " + value + "!<\/a> <\/li>").insertBefore(".what-we-do");
    } else {
        $(".nav-bar-items").append("<li class=\"user\"> <a href=\"\/dashboard.html\">Welcome " + value + "!<\/a> <\/li>")
    }
    $(".nav-bar-items").css("margin-left", "35%")
    $(".user").css("cursor", "default")
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

$(document).ready(function() {
    var ele = document.getElementById(".hamburger");
    var howto = document.querySelector(".how-to");
    var hamburger = document.querySelector(".hamburger");
    var navMenu = document.querySelector(".nav-bar-items");
    var main = document.querySelector(".wrapper");
    var header = document.querySelector(".header");
    var checkout = document.querySelector(".main-wrapper-checkout");

    hamburger.addEventListener("click", mobileMenu);

    function mobileMenu() {
        isToggle = true;
        howto.classList.toggle("active");
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        try {
            checkout.classList.toggle("active");
            header.classList.toggle("active");
            main.classList.toggle("active");

        } catch (error) {

        }

    }
    const navLink = document.querySelectorAll(".nav-item");

    navLink.forEach(n => n.addEventListener("click", closeMenu));

    function closeMenu() {
        isToggle = false;
        howto.classList.remove("active");
        checkout.classList.remove("active");
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        main.classList.remove("active");
        try {
            header.classList.remove("active");


        } catch (error) {}
    }
});

var returnUrl;
$(document).ready(function() {
    $(".500").on('click', function(event) {
        var totalSwipes = $('#500-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!value)) {
            location.href = "https://localhost/checkOut.html";
        } else {

            location.href = "https://localhost/login.html?returnUrl=/checkOut.html";
        }
    });
});
$(document).ready(function() {
    $(".1500").on('click', function(event) {
        var totalSwipes = $('#1500-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!value)) {
            location.href = "https://localhost/checkOut.html";
        } else {

            location.href = "https://localhost/login.html?returnUrl=/checkOut.html";
        }
    });
});

$(document).ready(function() {
    $(".2000").on('click', function(event) {
        var totalSwipes = $('#2000-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!value)) {
            location.href = "https://localhost/checkOut.html";
        } else {

            location.href = "https://localhost/login.html?returnUrl=/checkOut.html";
        }
    });
});

$(document).ready(function() {
    $(".2500").on('click', function(event) {
        var totalSwipes = $('#2500-swipes').val();
        localStorage.setItem("swipes", totalSwipes);

        event.preventDefault();
        if (!(!value)) {
            location.href = "https://localhost/checkOut.html";
        } else {

            location.href = "https://localhost/login.html?returnUrl=/checkOut.html";
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

$(document).ready(function() {
    $(".login-text").on('click', function(event) {
        var email = $(".text-box-login-email").val()
        var password = $(".text-box-login-password").val()
        console.log(email + password)
        $.ajax({
            xhrFields: { withCredentials: true },
            type: "POST",
            url: 'https://localhost:44345/login',
            data: JSON.stringify({
                UserName: email,
                Password: password
            }),
            contentType: "application/json",
            success: function(response) {
                var newurl = new URL(location.href);
                newurl = newurl.searchParams.get("returnUrl");
                if (!newurl) {
                    window.location.href = "https://localhost/dashboard.html"
                    setLoggedInState();
                } else {
                    console.log(newurl);
                    location.href = "https://localhost" + newurl;
                }

            },
            error: function(error) {
                console.log(error);
                console.log("wrong");
            }
        });
    });
});


$(document).ready(function() {
    // Add smooth scrolling to all links
    $("a").on('click', function(event) {
        if (this.hash !== "") {
            $('a').css('pointerEvents', 'none');
            event.preventDefault();
            var hash = this.hash;
            console.log(hash)
            $('html, body').animate({
                    scrollTop: $(hash).offset().top
                },
                1200,
                function() {
                    $('a').css('pointerEvents', 'auto');
                });
        }
    });
});

function bytesToHex(b) {
    /** @type {!Array} */
    var n = [];
    /** @type {number} */
    var bi = 0;
    for (; bi < b.length; bi++) {
        n.push((b[bi] >>> 4).toString(16));
        n.push((15 & b[bi]).toString(16));
    }
    return n.join("");
};

function bytesToString(bytes) {
    return decodeURIComponent(escape(n.bin.bytesToString(bytes)));
};

function rotl(b, g) {
    return b << g | b >>> 32 - g;
};

function endian(data) {
    if (data.constructor == Number) {
        return 16711935 & rotl(data, 8) | 4278255360 & rotl(data, 24);
    }
    /** @type {number} */
    var i = 0;
    for (; i < data.length; i++) {
        data[i] = endian(data[i]);
    }
    return data;
};

function first(t, d, a, b, expression, n, s) {
    var x = t + (d & a | ~d & b) + (expression >>> 0) + s;
    return (x << n | x >>> 32 - n) + d;
};

function second(b, g, j, i, n, r, s) {
    var t = b + (g & i | j & ~i) + (n >>> 0) + s;
    return (t << r | t >>> 32 - r) + g;
};

function third(req, res, next, err, done, n, s) {
    var x = req + (res ^ next ^ err) + (done >>> 0) + s;
    return (x << n | x >>> 32 - n) + res;
};

function fourth(a, b, c, d, x, s, ch) {
    var n = a + (c ^ (b | ~d)) + (x >>> 0) + ch;
    return (n << s | n >>> 32 - s) + b;
};

function bytesToWords(value) {
    /** @type {!Array} */
    var input = [];
    /** @type {number} */
    var j = 0;
    /** @type {number} */
    var i = 0;
    for (; j < value.length; j++, i = i + 8) {
        input[i >>> 5] |= value[j] << 24 - i % 32;
    }
    return input;
};

function wordsToBytes(words) {
    /** @type {!Array} */
    var bytes = [];
    /** @type {number} */
    var i = 0;
    for (; i < 32 * words.length; i = i + 8) {
        bytes.push(words[i >>> 5] >>> 24 - i % 32 & 255);
    }
    return bytes;
};

function stringToBytesS(o_content) {
    return stringToBytes(unescape(encodeURIComponent(o_content)));
};

function stringToBytes(s) {
    /** @type {!Array} */
    var bytes = [];
    /** @type {number} */
    var i = 0;
    for (; i < s.length; i++) {
        bytes.push(255 & s.charCodeAt(i));
    }
    return bytes;
};

function r(value, options) {
    if (value.constructor == String) {
        value = options && "binary" === options.encoding ? stringToBytesS(value) : stringToBytesS(value);
    } else {
        if (i(value)) {
            /** @type {!Array<?>} */
            value = Array.prototype.slice.call(value, 0);
        } else {
            if (!Array.isArray(value)) {
                value = value.toString();
            }
        }
    }
    var x = bytesToWords(value);
    /** @type {number} */
    var len = 8 * value.length;
    /** @type {number} */
    var b = 1732584193;
    /** @type {number} */
    var c = -271733879;
    /** @type {number} */
    var d = -1732584194;
    /** @type {number} */
    var a = 271733878;
    /** @type {number} */
    var i = 0;
    for (; i < x.length; i++) {
        /** @type {number} */
        x[i] = 16711935 & (x[i] << 8 | x[i] >>> 24) | 4278255360 & (x[i] << 24 | x[i] >>> 8);
    }
    x[len >>> 5] |= 128 << len % 32;
    /** @type {number} */
    x[14 + (len + 64 >>> 9 << 4)] = len;
    var FF = e._ff;
    var GG = e._gg;
    var HH = e._hh;
    var II = e._ii;
    /** @type {number} */
    i = 0;
    for (; i < x.length; i = i + 16) {
        /** @type {number} */
        var tintB = b;
        /** @type {number} */
        var y = c;
        /** @type {number} */
        var curr_photo = d;
        /** @type {number} */
        var up = a;

        b = first(b, c, d, a, x[i + 0], 7, -680876936);
        a = first(a, b, c, d, x[i + 1], 12, -389564586);
        d = first(d, a, b, c, x[i + 2], 17, 606105819);
        c = first(c, d, a, b, x[i + 3], 22, -1044525330);
        b = first(b, c, d, a, x[i + 4], 7, -176418897);
        a = first(a, b, c, d, x[i + 5], 12, 1200080426);
        d = first(d, a, b, c, x[i + 6], 17, -1473231341);
        c = first(c, d, a, b, x[i + 7], 22, -45705983);
        b = first(b, c, d, a, x[i + 8], 7, 1770035416);
        a = first(a, b, c, d, x[i + 9], 12, -1958414417);
        d = first(d, a, b, c, x[i + 10], 17, -42063);
        c = first(c, d, a, b, x[i + 11], 22, -1990404162);
        b = first(b, c, d, a, x[i + 12], 7, 1804603682);
        a = first(a, b, c, d, x[i + 13], 12, -40341101);
        d = first(d, a, b, c, x[i + 14], 17, -1502002290);
        c = first(c, d, a, b, x[i + 15], 22, 1236535329);
        b = second(b, c, d, a, x[i + 1], 5, -165796510);
        a = second(a, b, c, d, x[i + 6], 9, -1069501632);
        d = second(d, a, b, c, x[i + 11], 14, 643717713);
        c = second(c, d, a, b, x[i + 0], 20, -373897302);
        b = second(b, c, d, a, x[i + 5], 5, -701558691);
        a = second(a, b, c, d, x[i + 10], 9, 38016083);
        d = second(d, a, b, c, x[i + 15], 14, -660478335);
        c = second(c, d, a, b, x[i + 4], 20, -405537848);
        b = second(b, c, d, a, x[i + 9], 5, 568446438);
        a = second(a, b, c, d, x[i + 14], 9, -1019803690);
        d = second(d, a, b, c, x[i + 3], 14, -187363961);
        c = second(c, d, a, b, x[i + 8], 20, 1163531501);
        b = second(b, c, d, a, x[i + 13], 5, -1444681467);
        a = second(a, b, c, d, x[i + 2], 9, -51403784);
        d = second(d, a, b, c, x[i + 7], 14, 1735328473);
        c = second(c, d, a, b, x[i + 12], 20, -1926607734);
        b = third(b, c, d, a, x[i + 5], 4, -378558);
        a = third(a, b, c, d, x[i + 8], 11, -2022574463);
        d = third(d, a, b, c, x[i + 11], 16, 1839030562);
        c = third(c, d, a, b, x[i + 14], 23, -35309556);
        b = third(b, c, d, a, x[i + 1], 4, -1530992060);
        a = third(a, b, c, d, x[i + 4], 11, 1272893353);
        d = third(d, a, b, c, x[i + 7], 16, -155497632);
        c = third(c, d, a, b, x[i + 10], 23, -1094730640);
        b = third(b, c, d, a, x[i + 13], 4, 681279174);
        a = third(a, b, c, d, x[i + 0], 11, -358537222);
        d = third(d, a, b, c, x[i + 3], 16, -722521979);
        c = third(c, d, a, b, x[i + 6], 23, 76029189);
        b = third(b, c, d, a, x[i + 9], 4, -640364487);
        a = third(a, b, c, d, x[i + 12], 11, -421815835);
        d = third(d, a, b, c, x[i + 15], 16, 530742520);
        c = third(c, d, a, b, x[i + 2], 23, -995338651);
        b = fourth(b, c, d, a, x[i + 0], 6, -198630844);
        a = fourth(a, b, c, d, x[i + 7], 10, 1126891415);
        d = fourth(d, a, b, c, x[i + 14], 15, -1416354905);
        c = fourth(c, d, a, b, x[i + 5], 21, -57434055);
        b = fourth(b, c, d, a, x[i + 12], 6, 1700485571);
        a = fourth(a, b, c, d, x[i + 3], 10, -1894986606);
        d = fourth(d, a, b, c, x[i + 10], 15, -1051523);
        c = fourth(c, d, a, b, x[i + 1], 21, -2054922799);
        b = fourth(b, c, d, a, x[i + 8], 6, 1873313359);
        a = fourth(a, b, c, d, x[i + 15], 10, -30611744);
        d = fourth(d, a, b, c, x[i + 6], 15, -1560198380);
        c = fourth(c, d, a, b, x[i + 13], 21, 1309151649);
        b = fourth(b, c, d, a, x[i + 4], 6, -145523070);
        a = fourth(a, b, c, d, x[i + 11], 10, -1120210379);
        d = fourth(d, a, b, c, x[i + 2], 15, 718787259);
        c = fourth(c, d, a, b, x[i + 9], 21, -343485551);
        /** @type {number} */
        b = b + tintB >>> 0;
        /** @type {number} */
        c = c + y >>> 0;
        /** @type {number} */
        d = d + curr_photo >>> 0;
        /** @type {number} */
        a = a + up >>> 0;
    }
    return endian([b, c, d, a]);
};

function morph(e, options) {

    var digestbytes = r(e, options);
    var next = wordsToBytes(digestbytes);
    var hex = bytesToHex(next);
    //var digestbytes = [235,178,157,29,39,28,79,223,188,51,173,131,24,97,27,248];
    return options && options.asBytes ? next : options && options.asString ? bytesToString(next) : bytesToHex(next);
};

var e = "{\"$gpb\":\"badoo.bma.BadooMessage\",\"body\":[{\"message_type\":377,\"server_person_profile_edit_form\":{\"type\":[2,10,12,22,3,8,4,6,7,5,9]}}],\"message_id\":55,\"message_type\":377,\"version\":1,\"is_background\":false}whitetelevisionbulbelectionroofhorseflying";
var n = undefined;
var s = morph(e, n)




function LoginHash(data) {
    data = "{\"$gpb\":\"badoo.bma.BadooMessage\",\"body\":[{\"message_type\":15,\"server_login_by_password\":{\"remember_me\":true,\"user\":\"" + data.UserName + "\",\"password\":\"" + data.Password + "\",\"stats_data\":\"JTE5dm5ybnNucm5ybnJucm5ybnJucm5ybnJucm4lMkM3Li5ucm5ybnJucm5wc24lMkM3Li5uJTJDNy4ubnNuJTJDNy4ubnBzbiUyQzcuLm4lMkM3Li5uJTE5JTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwJTJCJTJDMjc2JTYwbiU2MCUyQiUyQzI3NiU2MG4lNjAlMkIlMkMyNzYlNjBuJTYwISolMjMlMkMlMjUnJTYwbiU2MDE3JTIwJTJGJTJCNiU2MCUxRm5xcW5wcm5ybnJucm5ybnJucm5ybnJucm5ybnJuc25ybnJucHVucm5zbnJudm52bnNuJTE5JTE5c3RwJTdCcyU3QiU3QnZyJTdCdXp6bnNybiUxOXd1cW5xcXolMUYlMUZuJTE5dHRucHNuJTE5d3VxbnFxem4lNjAlMkIlMkMyNzZhMiUyMzExNS0wJTI2c3RwJTdCcyU3QiU3QnZyJTdCdnNzbDYnJTNBNm8lMjQlMkInLiUyNiUxRCUxRCUyQiUyQzI3NmwoMW8xJTJCJTI1JTJDJTJCJTJDbzIlMjMxMTUtMCUyNiU2MCUxRiUxRm4lMTlwcXduc3JuJTE5d3VxbnFxJTdCJTFGJTFGbiUxOXZzc3VucHNuJTE5cm5ybiU2MCUyMDc2Ni0lMkNsJTIwNiUyQ2wlMjA2JTJDb28lMjAuLSEpJTYwJTFGJTFGJTFGbnp0biU2MCUwRi04JTJCLi4lMjNtd2xyYmolMTUlMkIlMkMlMjYtNTFiJTBDJTE2YnNybHJ5YiUxNSUyQiUyQ3R2eWIlM0F0dmtiJTAzMjIuJyUxNSclMjAlMDklMkI2bXdxdWxxdGJqJTA5JTBBJTE2JTBGJTBFbmIuJTJCKSdiJTA1JyEpLWtiJTAxKjAtJTJGJ20lN0JwbHJsdndzd2xzdyU3QmIlMTElMjMlMjQlMjMwJTJCbXdxdWxxdCU2MG4lNjAnJTJDbyUxNyUxMSU2MG5wdm56bnZub3N6cm5zbnNuc25zbnJucm4lNjAlMTUlMkIlMkNxcCU2MG42MDcnbiUyNCUyMy4xJ24lMkM3Li5uJTI0JTIzLjEnbiUyNCUyMy4xJ24lMjQlMjMuMSduJTI0JTIzLjEnbiUxOXJuJTI0JTIzLjEnbiUyNCUyMy4xJyUxRm4lMjQlMjMuMSduJTE5cyU3QnBybnNyenIlMUZuJTE5cyU3QnBybnNydnIlMUZuc24lMTklNjAlMDEqMC0lMkYnYiUxMiUwNiUwNGIlMTIuNyUyNSUyQiUyQ3h4JTEyLTA2JTIzJTIwLidiJTA2LSE3JTJGJyUyQzZiJTA0LTAlMkYlMjM2eHglMjMyMi4lMkIhJTIzNiUyQi0lMkNtJTNBbyUyNS0tJTI1LidvISowLSUyRidvMiUyNiUyNCUzQzIlMjYlMjQlNjBuJTYwJTAxKjAtJTJGJ2IlMTIlMDYlMDRiJTE0JTJCJzUnMHh4eHglMjMyMi4lMkIhJTIzNiUyQi0lMkNtMiUyNiUyNCUzQzIlMjYlMjQlNjBuJTYwJTBDJTIzNiUyQjQnYiUwMS4lMkInJTJDNnh4eHglMjMyMi4lMkIhJTIzNiUyQi0lMkNtJTNBbyUyQyUyMyEuJTNDbiUyMzIyLiUyQiElMjM2JTJCLSUyQ20lM0FvMiUyQyUyMyEuJTNDJTYwJTFGbiUxOSUxRm4lMjQlMjMuMSduJTE5NjA3J242MDcnJTFGJTFG\"}}],\"message_id\":2,\"message_type\":15,\"version\":1,\"is_background\":false}";
    console.log(data)
    let strEnd = data.concat("whitetelevisionbulbelectionroofhorseflying");
    var x = morph(strEnd, undefined);
    return x;
}

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
    console.log(data.Service + "eeeeeeeeeee")
    var xping = LoginHash(data)
    data.XPing = xping
    console.log(this)
    var btnName = context.classList[2];

    $('.' + btnName).hide();
    $('.credentials-box-wrapper-' + serviceName).append('<div class="loader"></div>');
    $('.loader').css('display', 'block');

    $('.' + context.parentNode.children[0].classList[1]).hide();
    $('.login-' + serviceName).hide();
    $.ajax({
        type: "POST",
        xhrFields: { withCredentials: true },
        url: 'https://localhost:44345/api/login',
        data: JSON.stringify({
            XPing: data.XPing,
            UserName: data.UserName,
            Password: data.Password,
            Service: data.Service
        }),
        contentType: "application/json",
        success: function(response) {

            $('.loader').remove();
            $('.btnName').show();
            $('.credentials-box-wrapper-' + serviceName).prepend('<div class=\"service-message message-badoo\"><p>Start at </p> <input class=\"date-badoo date-service\" type=\"datetime-local\"></div>');
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
    let username = $('.text-box-register-email').val()
    let password = $('.text-box-register-password').val()
    console.log(username)
    data = {
        UserName: username,
        Password: password,
    }

    $.ajax({
        type: "POST",
        xhrFields: { withCredentials: true },
        url: 'https://localhost:44345/register',
        data: JSON.stringify({
            XPing: data.XPing,
            UserName: data.UserName,
            Password: data.Password
        }),

        contentType: "application/json",
        success: function(response) {
            alert("here")
            location.href = "https://localhost/dashboard.html";
        },
        error: function(error) {
            console.log(error);
        }
    });
}

var userId;
var sessionId;

function GetImages() {
    data = "{\"$gpb\":\"badoo.bma.BadooMessage\",\"body\":[{\"message_type\":403,\"server_get_user\":{\"user_id\":\"" + userId + "\",\"user_field_filter\":{\"projection\":[210,370,650,660,731,730,670,93,91,540,530,230,680,303,301,420,410,600,250,610,260,580,290,732,304,90,570,550,200,330,331,310,690,490,340,870,750,460,480,800,291,100,311,681,360,50,1000,1200,770,930,494],\"request_albums\":[{\"album_type\":2,\"preview_size\":{\"height\":180,\"width\":180}},{\"album_type\":7,\"preview_size\":{\"height\":180,\"width\":180}},{\"album_type\":4,\"preview_size\":{\"height\":180,\"width\":180}}],\"united_friends_filter\":[{\"section_type\":3,\"count\":5},{\"section_type\":1,\"count\":5},{\"section_type\":2,\"count\":5}],\"request_interests\":{\"user_id\":\"" + userId + "\",\"limit\":500},\"quick_chat_request\":{\"message_count\":5}},\"client_source\":8,\"visiting_source\":{\"person_id\":\"" + userId + "\",\"source_folder\":-1,\"visiting_source\":8}}}],\"message_id\":19,\"message_type\":403,\"version\":1,\"is_background\":false}";
    console.log(data)
    let strEnd = data.concat("whitetelevisionbulbelectionroofhorseflying");
    var x = morph(strEnd, undefined);
    return x;
}

function getImages() {
    var xping = GetImages()
    data = {
        UserId: userId,
        SessionId: sessionId
    }
    data.XPing = xping
    console.log(data)
    $.ajax({
        type: "POST",
        url: 'https://localhost:44345/api/getImages',
        data: JSON.stringify({
            XPing: data.XPing,
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
                        //index is also the services name cuz its an enum
                        data.push({ Service: index, Likes: value })
                    }
                }
            }
            console.log(data)
            $.ajax({
                type: "POST",
                url: 'https://localhost:44345/api/schedule',
                xhrFields: { withCredentials: true },
                data: JSON.stringify(data),
                dataType: "json",
                contentType: 'application/json',
                success: function(response) {
                    let res = response;

                    console.log(response);
                },
                error: function(error) {
                    console.log(error);
                }
            });
        } else {
            unauhorizedServices.forEach(element => {

                $('.service-' + element).css('border', '2px solid red');

                $('.service-credentials-' + element).prepend('<div style=position:absolute; class="error-service-login error-' + element + '">Please log into service</div>');

            });
        }
        if (clickServicesList.length == 0) {
            services.forEach(element => {
                $('.service-' + element).css('border', '2px solid red');

            });
        }
    });
});
$(document).on("click", "#upload", function() {
    var file_data = $("#avatar").prop("files")[0];
    var file = new FormData();
    data = {
        UserName: "Roman135",
        Service: 0,
        Id: "611eabd43131a540a0a478f5"
    }
    file.append("file", file_data);
    file.append("data", JSON.stringify(data));
    console.log(data)
    $.ajax({
        url: 'https://localhost:44345/api/uploadImage',
        type: "POST",
        dataType: 'json',
        data: file,
        processData: false,
        contentType: false,
        success: function(msg) {

        },
        error: function(error) {},
    })
})

function loginuser() {
    let password = $('.pwd').val()
    let username = $('.username').val()
    $.ajax({
        type: "POST",
        url: 'https://localhost:44345/login',
        data: JSON.stringify({
            UserName: username,
            Password: password
        }),
        dataType: "json",
        contentType: "application/json",
        success: function(response) {
            userId = response.user_id;
            sessionId = response.session_id;
            console.log(response);
            console.log(response.user_id);
        },
        error: function(error) {
            console.log(error);
        }
    });
}