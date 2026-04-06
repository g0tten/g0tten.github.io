(function($){
  $(function(){
    $(".button-collapse").sideNav();

    var path = window.location.pathname.replace(/index\.html$/, "");
    if (path === "") {
      path = "/";
    }

    $(".nav-link").each(function(){
      var href = $(this).attr("href");
      if (!href) return;
      var normalized = href.replace(/index\.html$/, "");
      if (normalized === path || (normalized !== "/" && path.indexOf(normalized) === 0)) {
        $(this).addClass("is-active");
      }
    });
  });
})(jQuery);
