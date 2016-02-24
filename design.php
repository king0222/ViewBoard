<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no"/>
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <meta name="renderer" content="webkit">
  <title>花生居DIY设计</title>
  <meta name="keywords" content="<?php echo trig_mvc_template::$keywords; ?>">
  <meta name="description" content="<?php echo trig_mvc_template::$description; ?>">
  <script type="text/javascript">
  var DEBUGGER = 0,
      ua = navigator.userAgent.toLowerCase();
  function isIE() {
    if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
    else
        return false;
  }
  if (isIE() && !(ua.indexOf("trident") > -1 && ua.indexOf("rv") > -1)) {
      window.location = 'design-redirect.html';
  }

  var cssPath = '/design/css/style.css';
  var random = 'bust=' + new Date().getTime();
  var require = {
      baseUrl: '/design/',
      waitSeconds: 15,
      urlArgs : random,
      deps : ['js/DIY/index']
  };
  if (!DEBUGGER) {
      cssPath = '/design/build/css/style.css';
      require.deps = ['build/js/DIY/index'];
  }
  (function() {
    var link = document.createElement('link');
        link.href = cssPath;
        link.rel = 'stylesheet';
        link.type = 'text/css';
    document.getElementsByTagName('head')[0].appendChild(link);
    var script = document.createElement('script');
        script.src = '/design/js/lib/require.js';
    document.getElementsByTagName('head')[0].appendChild(script);
  })();
  

  </script>

</head>
<body>
<?php echo $content; ?>
</body>
</html>