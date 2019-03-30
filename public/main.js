const calculateDynamics = () => {
    const dynamics = $('.dynamic-height');
    $.each(dynamics, (i, val) => {
        const width = $(val).width();
        $(val).css('height', width);
    });
}

// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationsList, observer) => {
    for(var mutation of mutationsList) {
        if (mutation.type == 'attributes') {
            verticallyAlign();
        }
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(document.body, config);


const verticallyAlign = () => {
    const contentContainers = $('.contents');
    $.each(contentContainers, (i, val) => {
        const height = $(val).height();
        const containerHeight = getComputedStyle($(val).closest('.container-height').get(0), null).getPropertyValue("height").split('px')[0];
        const containerPadding = getComputedStyle($(val).closest('.container-height').get(0), null).getPropertyValue("padding").split('px')[0];
        const topMarg = (containerHeight  - (containerPadding * 2) - height) / 2;
        $(val).css('margin-top', `${topMarg}px`);
    });
}

const centerAlign = () => {
    const contentContainers = $('#photo-here img');
    $.each(contentContainers, (i, val) => {
        const width = $(val).width();
        const containerWidth = getComputedStyle($('#photo-here').get(0), null).getPropertyValue("width").split('px')[0];
        const containerPadding = getComputedStyle($('#photo-here').get(0), null).getPropertyValue("padding").split('px')[0];
        const leftMarg = (containerWidth  - (containerPadding * 2) - width) / 2;
        $(val).css('margin-left', `${leftMarg}px`);
    });
}

const showManualScreen = () => {
    $('.screen').hide();
    $('#manual-screen').show();
}

const showAutoScreen = () => {
    $('.screen').hide();
    $('#auto-screen').show();
}

const showHomeSceen = () => {
    $('.screen').hide();
    $('#home-screen').show();
}

$('#go-manual').click(showManualScreen);
$('#go-auto').click(showAutoScreen);
$('#go-home').click(showHomeSceen);
$('.back-button').click(showHomeSceen);

const pictureShower = () => {
    const htmlContents = `<img src=${getRandomImage()}>`
    var tmpImg = new Image();
    tmpImg.src = getRandomImage()
    

    tmpImg.onload = function() {
        $('#go-picture').fadeOut('fast', () => {
            $('#photo-subscreen').fadeIn('fast');
        })
        verticallyAlign();
        centerAlign();
        setTimeout(() => {
            $('#photo-subscreen').fadeOut('fast', ()=> {
                $('#go-picture').fadeIn('fast');
            });
        }, 3000)
    };
    $('#photo-here').html(tmpImg);
}

$('#go-picture').click(pictureShower);

/////////////////////////////////////////////////         RANDOM IMAGE STUFF         /////////////////////////////////////////////////
const initializeImageStorage = () => {
    // Get a reference to the storage service, which is used to create references in your storage bucket
    const images = firebase.database().ref('images')
    images.once('value', (snap) => {
        window.images = snap.val();
    });
}   

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


const getRandomImage = () => {
    const ran = getRandomInt(0, window.images.length - 1);
    return window.images[ran];
}

/////////////////////////////////////////////////              AUTO POSTER           /////////////////////////////////////////////////
$('#meeting-info').on('submit', (e) => {
    e.preventDefault();

    const form = {
        meetingLength: parseInt($('#meeting-length').val()),
        meetingTime: $('#meeting-time').val(),
        phone: `+1${$('#phone').val().replace('.', '').replace('-', '')}`
    }

    if (form.phone && form.meetingLength && form.meetingTime) {
        // https://meeting-sass.herokuapp.com/
        $.ajax({
            type: "POST",
            url: 'https://meeting-sass.herokuapp.com/messager',
            data: form,
            dataType: "json"
        }).done((response) => {
            $('#display-text').text('Watch for alerts on your phone.');
            setTimeout(() => {
                showHomeSceen();
            }, 10000)
        }).fail(() => {$('#display-text').text('You did something wrong.');})
    } else {
        $('#display-text').text('You did something wrong.');
    }
    
})


$(document).ready(() => {
    $.get('./apiKeys.json').then((config) => {
        firebase.initializeApp(config);
        initializeImageStorage();
        calculateDynamics();
        showHomeSceen();
    })
    $('.timepicker').timepicker();
});
