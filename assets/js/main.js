(function($){
  $(function(){
    $(".button-collapse").sideNav();

    $(".drawer-close").on("click", function(e){
      e.preventDefault();
      $(".button-collapse").sideNav("hide");
    });

    $(document).on("keydown", function(e){
      if (e.key === "Escape" || e.keyCode === 27) {
        $(".button-collapse").sideNav("hide");
      }
    });

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
