const calculateDynamics = () => {
    const dynamics = $('.dynamic-height');
    $.each(dynamics, (i, val) => {
        const width = $(val).width();
        $(val).css('height', width);
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
$('#go-auto').click(showManualScreen);
$('#go-home').click(showHomeSceen);


$(function() {
    calculateDynamics();
    showHomeSceen();
});
