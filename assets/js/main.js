(function($){
  $(function(){
    $(".button-collapse").sideNav({
      closeOnClick: true
    });

    $(".collapsible").collapsible();
    $(".tooltipped").tooltip({delay: 30});

    var currentPath = window.location.pathname.replace(/\/$/, "");
    if (currentPath === "") {
      currentPath = "/";
    }

    $(".nav-link").each(function(){
      var href = $(this).attr("href");
      if (!href) return;

      var resolved = href.replace(window.location.origin, "").replace(/\/$/, "");
      if (resolved === "") {
        resolved = "/";
      }

      if (resolved === currentPath || (currentPath !== "/" && resolved !== "/" && currentPath.indexOf(resolved) === 0)) {
        $(this).addClass("is-active");
      }
    });
  });
})(jQuery);
