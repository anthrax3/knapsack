

var warningShowing = false;

$(function() {


    // VARIABLES

    var basketWeight = 0;
    var basketValue = 0;
    var basketMaxWeight = 500;


    // FUNCTIONS

    //TODO: Make things draggable

    function toggleFade(itemSelector, shouldShow) {
        //itemSelector: a jQuery selector
        //shouldShow: true if should show; false if should hide
        var opacity = shouldShow ? 1.0 : 0.0;
        itemSelector.fadeTo(300, opacity);
    }

    function getSelector(trId, num) {
        return $("tr#"+trId+" td."+num+" img");
    }

    function flipItem(num, isUp) {
        //This function is called AFTER it has been determined safe to add/remove something in the basket. It "flips" the item from one section to the other (up to down, or vice versa).
        //num: the number of the item to flip
        //isUp: true if item is up; false if item is down
        var upItemSelector = getSelector("upItems", num);
        var downItemSelector = getSelector("downItems", num);

        toggleFade(downItemSelector, isUp);
        toggleFade(upItemSelector, !isUp);

        upItemSelector.attr("data-shown", !isUp);
    }

    function updateValues(weight, value) {
        basketWeight += weight;
        basketValue += value;
        $("span#basketValue").html(basketValue);
        $("span#basketWeight").html(basketWeight);
    }

    function showWarning() {
        if (!warningShowing) {
            //TODO: This does not actually work; warnings flash multiple times, 
            //such that 10 rapid clicks results in 10 slowly-flashing warnings
            warningShowing = true;
            $("div#nope").fadeTo(250, 1.0);
            $("div#nope").fadeTo(500, 0.0);
            warningShowing = false;
        }
    }

    function toggle(num) {
        //This is an event that occurs whenever the item at `num' is clicked

        //num: the column number (represented as the class of the DOM element) of the relevant item
        var upItemSelector = getSelector("upItems", num);
        var downItemSelector = getSelector("downItems", num);
        var isUp = upItemSelector.attr("data-shown"); //true if shown
        isUp = (isUp === "true");

        var itemWeight = parseInt(upItemSelector.attr("data-weight"));
        var itemValue = parseInt(upItemSelector.attr("data-value"));

        var newWeight = basketWeight + itemWeight

        if (isUp) {
            // In this case, we first need to check if basket is full!
            if (basketMaxWeight < newWeight) {
                showWarning();
            } else {
                // Move from store to basket
                updateValues(itemWeight, itemValue);
                flipItem(num, isUp);
            }
        } else {
            // Move from basket to store
            updateValues(-itemWeight, -itemValue);
            flipItem(num, isUp);
        }
    }

    //MAIN METHOD
    
    // Zero the basket
    updateValues(0,0);
    $("span#basketMaxWeight").html(basketMaxWeight);

    // Set a click listener for each item
    $("tr img.item").each(function() {
        $(this).click(function() {
            var num = $(this).parents("td").attr("class");
            toggle(num);
        });
    });

    
    // Fade all of the basket items
    $("tr#downItems img").each(function() {
        $(this).fadeTo(0,0.0);
    });

    // Make all of the items' labels visible
    $("tr#numbers span.value").each(function() {
        var num = $(this).parents("td").attr("class");
        $(this).html(getSelector("upItems", num).attr("data-value"));
    });
    $("tr#numbers span.weight").each(function() {
        var num = $(this).parents("td").attr("class");
        $(this).html(getSelector("upItems", num).attr("data-weight"));
    });

    // Hide the warning message
    $("div#nope").fadeTo(0,0.0);
});