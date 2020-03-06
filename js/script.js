$(function() {

    $('body').css({ 'backgroundImage': bg });
    // let noOfQuest =0;
    let totalQuestion = data.length;
    let totalCorrectAns = 0;
    let questionPerPage = questPerPage;
    let questionIndex = 0;
    let correctAns = '';
    let chance = 0;
    let optContainer = $('.ansContainer p');

    // let x = 2; // To check all images dragged or not.

    // url value
    let url = window.location.href;
    let params;
    if (url.indexOf('?') > 0) {
        params = new URLSearchParams(url.substring(1));
        let geturl = document.location.search;
        questionPerPage = parseInt(params.get('qpp'));
        questionIndex = parseInt(params.get('qno'));
        totalCorrectAns = parseInt(params.get('ca'));
        // console.log("url variable available....");
    } else {
        // console.log("url variable not available...");
    }

    let showQuestion = function() {
        let mainHtml = '';
        let ansData = ''
        // if() 
        for (questionIndex; questionIndex < questionPerPage; questionIndex++) {
            let html = `<div class="question quest1">${questionIndex+1}. ${data[questionIndex].questPart1}
            <span data-name="${data[questionIndex].ans}" class="dropp" data-ans=''></span>
             <img class="wrong" src="img/wrong.png">
             <img class="right" src="img/right.png">${data[questionIndex].questPart2}</div>`;
            mainHtml += html;

            let html2 = `<p><span id='${data[questionIndex].ans}' class="dragg">${data[questionIndex].ans}</span></p>`;
            ansData += html2;
        }

        $('.questionContainer').html(mainHtml);
        $('.ansContainer').html(ansData);

    }

    showQuestion();

    function dragDrop() {
        $(".dropp").droppable({
            accept: ".dragg",
            hoverClass: "dropHover",

            drop: function(event, ui) {
                var dragItem = ui.draggable.attr("id");
                var dropItem = event.target;
                if ($(dropItem).hasClass('filled')) {
                    ui.draggable.draggable('option', 'revert', true);
                } else {


                    $(dropItem).addClass('filled').attr('data-ans', dragItem);
                    ui.draggable.draggable('option', 'revert', false);
                    ui.draggable.draggable({ disabled: true });
                    // To centering the element inside the droppable area...
                    let $this = $(this);
                    ui.draggable.position({
                        my: "center",
                        at: "center",
                        of: $this,
                        using: function(pos) {
                            $(this).animate(pos, "fast", "linear");
                        }
                    });
                }
            }

        });

        $('.dragg').draggable({
            revert: 'invalid'
        });
    }

    // change the position of ans options

    function generateRandomSuggestion() {
        $.each($('.ansContainer p'), function(index, value) {
            $(this).css({
                'order': Math.floor((Math.random() * questionPerPage) + 1)
            });
        })
    }
    generateRandomSuggestion();
    // end change the position of ans options


    dragDrop();

    $('#reset').click(function() {
        // location.reload();
        if (url.indexOf('?') > 0) {
            // params = new URLSearchParams(url.substring(1));

            questionIndex = parseInt(params.get('qno'));
        } else {
            questionIndex = 0;
        }

        showQuestion();
        dragDrop();
        correctAns = 0;
        generateRandomSuggestion();
    })


    $('#submit').click(function() {
        if ($('.dropp').hasClass('filled')) {
            checkAns();
        } else {
            $('.error').fadeIn();
            setTimeout(function() {
                $('.error').fadeOut();
            }, 3000)
        }
    });


    // check Answer

    let checkAns = function() {
        $('.right').hide();
        $('.wrong').hide();
        correctAns = 0;
        chance++;
        let droppLength = $('.dropp').length;


        $.each($('.dropp'), function(index, value) {
            let dataName = $(this).attr('data-name');
            let dataAns = $(this).attr('data-ans');
            if (dataName === dataAns) {
                $(this).parent().find('.right').show();
                correctAns++;
            } else {
                $(this).parent().find('.wrong').show();
            }
        })

        if (droppLength == correctAns) {
            $('#reset').hide();
            $('#submit').hide();
            // $('#reload').show();
            if (totalQuestion == questionPerPage) {
                $('#checkScore').show();
                $('#next').hide();
            } else {
                $('#next').show();
            }
        } else {
            if (chance > 1) {
                $('#reset').hide();
                $('#showAns').show();
                // $('#next').show();
                // $('#reload').hide();
                $('#submit').hide();
                if (totalQuestion == questionPerPage) {
                    $('#checkScore').show();
                    $('#next').hide();
                } else {
                    $('#next').show();
                }
            }
        }
    }

    $('#showAns').click(function() {
        $.each($('.dropp'), function(index, value) {
            $(this).html("<span class='showTheAns'>" + $(this).attr('data-name') + "</span>");
            $('.right').show();
            $('.wrong').hide();
        })

        $(this).hide();
        $('.dragg').hide();
        //$('#submit').hide();
        // $('#next').show();
                        if (totalQuestion == questionPerPage) {
                    $('#checkScore').show();
                    $('#next').hide();
                } else {
                    $('#next').show();
                }
        // $('#reload').show();

    });

    $('#reload').click(function() {
      let indexLocation =  window.location.href.split('?')[0];
       window.location.href=indexLocation;
    })





    $('#next').click(function() {
        totalCorrectAns = totalCorrectAns + correctAns;
        next();
    })

    let next = function() {
        questionPerPage = questionPerPage + questPerPage;
        // questionPerPage = 3 + 3;
        if (questionPerPage > totalQuestion) {
            questionPerPage = totalQuestion;
        }

        let url2 = window.location.pathname;
        console.log("The Current url is: " + url2);
        var newurl = url2 + `?data=all&qno=${questionIndex}&qpp=${questionPerPage}&ca=${totalCorrectAns}`;
        window.location.href = newurl;
    }


    $("#checkScore").click(function(){
        $('.dragg').hide();
        $('#reload').show();
        $("#showAns").hide();
        $(this).hide();
        let scoreHTML = `
            <div class='score'>
                <p>Total no of question is : <span>${totalQuestion}</span></p>
                <p>Your correct answer is : <span>${totalCorrectAns+correctAns}</span></p>
            </div>`;
        $('.questionContainer').html(scoreHTML);
    })


    // checkAns()

});