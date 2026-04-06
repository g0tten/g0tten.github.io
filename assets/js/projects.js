$(document).ready(function(){
  $('.geopattern').each(function(){
    $(this).geopattern($(this).data('pattern-id'));
  });
});

function toggleForked(){
  if ($('.fork-switch').prop('checked')) {
    $('[data-fork="true"]').addClass('hidden');
  } else {
    $('[data-fork="true"]').removeClass('hidden');
  }
}
