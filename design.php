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
<div class="body-container">
  <div class="wrap">
    <div id="header">
      <canvas id="headerCanvas"></canvas>
      <div class="widget menu component tool" id="menu-tool">
        <a href="/#"><img class="design-logo" src="design/images/logo_48px.png"></a>
        <ul>
          <li><button class="btn icon-new new" title="新建"><i class="iconfont">&#xe659;</i></button></li>
          <li><button class="btn icon-save save" title="保存方案"><i class="iconfont">&#xe656;</i></button></li>
          <!-- <li><button class="btn icon-download download" title="下载"><i class="iconfont">&#xe67e;</i></button></li> -->
          <!-- <li><button class="btn icon-saveas saveas" title="另存为"><i class="iconfont">&#xe665;</i></button></li> -->
          <!-- <li><button class="btn icon-select-bg select-bg" title="选择背景"><i class="iconfont">&#xe65d;</i></button></li> -->
          <!-- <li><button class="btn icon-clear clear" title="清空"><i class="iconfont">&#xe662;</i></button></li> -->
          <li><button class="btn icon-undo undo" title="撤销"><i class="iconfont">&#xe653;</i></button></li>
          <li><button class="btn icon-redo redo" title="重做"><i class="iconfont">&#xe655;</i></button></li>
          <li><button class="btn icon-center center" title="居中"><i class="iconfont">&#xe660;</i></button></li>
          <li><button class="btn icon-big copy" title="复制"><i class="iconfont">&#xe644;</i></button></li>
          <li><button class="btn icon-big del" title="删除"><i class="iconfont">&#xe63a;</i></button></li>
          
          <li><button class="btn icon-big big" title="放大"><i class="iconfont">&#xe652;</i></button></li>
          <li><button class="btn icon-small small" title="缩小"><i class="iconfont">&#xe654;</i></button></li>
          <li><button class="btn icon-flip flip" title="垂直翻转"><i class="iconfont">&#xe65e;</i></button></li>
          <li><button class="btn icon-flop flop" title="水平翻转"><i class="iconfont">&#xe65f;</i></button></li>
          <li><button class="btn icon-up up" title="向上一层"><i class="iconfont">&#xe65a;</i></button></li>
          <li><button class="btn icon-down down" title="向下一层"><i class="iconfont">&#xe65b;</i></button></li>
          <li><button class="btn icon-down top" title="置顶"><i class="iconfont">&#xe658;</i></button></li>
          <li><button class="btn icon-down bottom" title="置底"><i class="iconfont">&#xe657;</i></button></li>
        </ul>
      </div>
      <div class="layouts">
        <ul>
          <li class="user-layouts">
            <?php if ($user_info) {?>
            您好！<?php echo !empty( $user_info['real_name'] ) ? $user_info['real_name'] : $user_info['user_name'];?>
            <a class="text-main" href="<?php echo trig_mvc_route::get_uri('user','logout');?>">退出登录</a>
            <?php }else{ ?>
            <a class="iconfont" title="登录">&#xe623;</a>
            <?php }?>
          </li>
          <li><button class="btn fullscreen"><i class="iconfont">&#xe682;</i></button></li>
          <li><button class="btn leftmenu"><i class="iconfont">&#xe67f;</i></button></li>
          <li><button class="btn rightmenu"><i class="iconfont">&#xe680;</i></button></li>
          <li><button class="btn originlayout active"><i class="iconfont">&#xe681;</i></button></li>
        </ul>
      </div>
    </div>
    <div class="wrapper">
      <div id="aside">
        <aside>
          <div class="tab">
            <ul id="mainTab">
              <li class="active" data-id="products">产品库</li>
              <li data-id="backgrounds">背景库</li>
              <li data-id="myFavorites">我的收藏</li>
              <!-- <li data-id="materials">个人素材库</li> -->
              <li data-id="combinations">搭配列表</li>
            </ul>
          </div>
          <div class="mod tab-container">
            <div id="loading"></div>
            <div class="mod tab-panel active" id="products">

              <div class="levels">
                <div class="mod toolbar">
                  <input type="text" class="text input-search category-input" placeholder="搜索关键字">
                  <button class="btn icon-search category-search"><i class="iconfont">&#xe617;</i></button>
                  <button class="btn icon-refresh category-refresh"><i class="iconfont">&#xe661;</i></button>
                </div>
                <div class="mod scroll">
                  <div class="box">
                    <div class="content">
                      <!-- template content place here -->
                    </div>
                  </div>
                </div>  
              </div> 

              <div class="levels" style="display:none">
                <!-- <div class="crumbs"><a class="level-to" href="#">产品库</a> >> <a href="#" class="crumbs-title-2">沙发</a></div> -->
                <div class="mod scroll drag-items">
                  <div class="box">
                    <div class="content">
                      <!-- template contents place here-->
                    </div>
                  </div>
                </div>  
              </div>

              <div class="levels" style="display:none">
                <!-- <div class="crumbs"><a class="level-to" href="#">产品库</a> >> <a class="level-to crumbs-title-2" href="#">儿童房</a> >> <a class="crumbs-title-3" href="#">儿童床</a></div>
                <div class="mod toolbar">
                  <input type="text" class="text input-search">
                  <button class="btn icon-search"><i class="iconfont">&#xe617;</i></button>
                  <button class="btn icon-refresh"><i class="iconfont">&#xe661;</i></button>
                </div> -->
                <div class="mod scroll drag-items">
                  <div class="box">
                    <div class="content">
                      <!-- template contents place here-->
                    </div>
                  </div>
                </div>  
              </div>

            </div>
            <div class="mod tab-panel" id="backgrounds">
              <div class="levels">
                <div class="mod scroll">
                  <div class="box">
                    <div class="content">
                      <ul>
                        <!-- <li class="product-category" data-source="backgrounds">
                          <img class="drag-bg" src="design/images/DIY/img_bg_s.jpg">
                          <a href="javascript:void(0);">客厅</a>
                        </li> -->
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              <div class="levels" style="display:none" id="drag-bg">
                <div class="crumbs"><a class="level-to" data-level="1" href="#">背景图</a> >> <a href="#">客厅</a></div>
                <!-- <div class="mod toolbar">
                  <input type="text" class="text input-search">
                  <button class="btn icon-search"><i class="iconfont">&#xe617;</i></button>
                  <button class="btn icon-refresh"><i class="iconfont">&#xe661;</i></button>
                </div> -->
                <div class="mod scroll drag-items">
                  <div class="box">
                    <div class="content">
                      <!-- template contents place here-->
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mod tab-panel" id="myFavorites">
              <div class="mod scroll drag-items">
                <div class="box">
                  <div class="content">
                    <p>您还未登录，不能查看收藏列表！<button class="go-login">登录</button></p>
                    <!-- template contents place here-->
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="mod tab-panel" id="materials">
              <div class="mod toolbar">
                <input type="file" class="meterial-upload-input">
                <button class="btn icon-upload meterial-upload"><i class="iconfont">&#xe67c;</i></button>
                <button class="btn icon-refresh meterial-refresh"><i class="iconfont">&#xe661;</i></button>
              </div>
              <div class="mod scroll drag-items">
                <div class="box">
                  <div class="content">
                    
                  </div>
                </div>
              </div>
            </div> -->
            <div class="mod tab-panel" id="combinations">
              <div class="mod scroll">
                <div class="box">
                  <div class="content">
                    <p>您还未登录，不能查看已搭建的套装！<button class="go-login">登录</button></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
      <div class="" id="container-editor">
        <div id="mainArea">
          <div class="mod" id="drag-target">
            <div class="loading-remind"></div>
            <div class="bg-tools">
              <span class="unlock" title="选择背景"><i class="iconfont">&#xe670;</i></span>
              <span class="lock" title="锁定背景" style="display:none;"><i class="iconfont">&#xe667;</i></span>
              <span class="full" title="平铺背景"><i class="iconfont">&#xe622;</i></span>
            </div>
            <!-- <div class="mod target-wrap">
              
            </div> -->
            <div class="drag-item widget component handler" id="handler">
                <div id="resizeTL" class="resize widget nw" style="cursor: nw-resize;"></div>
                <div id="resizeTR" class="resize widget ne" style="cursor: ne-resize;"></div>
                <div id="resizeBR" class="resize widget se" style="cursor: se-resize;"></div>
                <div id="resizeBL" class="resize widget sw" style="cursor: sw-resize;"></div>
                <!-- <div class="edge usa n" style="display: none;"></div>
                <div class="edge usa e" style="display: none;"></div>
                <div class="edge usa s" style="display: none;"></div>
                <div class="edge usa w" style="display: none;"></div> -->
                <div class="edge widget z" style="display: block;">
                  <div class="point widget"></div>
                </div>
                <div class="measure-tool">
                  <div class="center"></div>
                  <div class="resize nw">nw</div>
                  <div class="resize ne">ne</div>
                  <div class="resize se">se</div>
                  <div class="resize sw">sw</div>
                </div>
              </div>
          </div>
          <div id="prodectDetail">
            <span class="pin"><i class="iconfont">&#xe602;</i></span>
            <div class="content"></div>
          </div>
        </div>
        <div class="" id="attr">
          <span class="pin"><i class="iconfont">&#xe68f;</i></span>
          <div class="mod drag-items" id="attrStyle">
            <div class="title">角度图</div>
            <div class="content">
            </div>
          </div>
          <div class="mod p10 pr active1" id="attrResize">
            <div class="title">尺寸</div>
            <div class="content">
              <div class="mod p10">
                <span class="text">宽度：</span>
                <input type="text" class="text" id="resizeW" disabled>
                <span class="text pl10">高度：</span>
                <input type="text" class="text" id="resizeH" disabled>
              </div>
              <div class="mod slider-wrap"><div id="slider"></div><div class="slider-val"><input type="text" value="100" id="sliderValue" class="fl text"><span>%</span></div></div>
              <div class="mod mask"></div>
            </div>
          </div>
          <div class="mod p10 pr" id="matting">
            <!-- <div class="title">抠图</div> -->
            <div class="content">
              <button id="cropImage" class="btn_matting" disabled="true"><i class="iconfont">&#xe68e;</i>图片处理</button>
            </div>
          </div>
          <!-- <div class="mod p10 pr" id="remark">
            <div class="content">
              <div class="row">
                <label>提示：</label>
                <input type="text">
              </div>
            </div>
          </div> -->
        </div>
      </div> 
    </div>
    
    <!-- <div id="mask"></div> -->
  </div>
</div>

<!-- 抠图html开始 -->
<div class="cropHolder" style="display:none;">
  
  <section id="pasteBoard" class="pasteBoard">
    <section id="tools" class="mainTools">
      <ul class="toolsList">
        <li class="canvas-tool tool rebuild"><i class="iconfont">&#xe653;</i>重做</li>
        <!-- <li class="tool"><span class="block magicWandTool" data-tool="magicWandTool">Magic Wand</span></li> -->
        <!-- <li class="tool"><span class="block pathSelectionTool" data-tool="pathSelectionTool">Path Selection</span></li> -->
        <li class="canvas-tool tool"><i class="iconfont penTool" data-tool="penTool">&#xe649;</i></li>
        <!-- <li class="tool"><span class="block zoomTool" data-tool="zoomTool">Zoom</span></li> -->
        <li class="canvas-tool tool"><i class="iconfont crop" data-tool="cropTool">&#xe64a;</i></li>
      </ul>
      <ul class="crop-operation" style="display:none;">
        <li class="tool cancel"><i class="iconfont">&#xe68b;</i></li>
        <li class="tool yes"><i class="iconfont">&#xe68c;</i></li>
      </ul>
    </section>
    <canvas id="artCanvas"></canvas>
    <canvas id="selectionCanvas" width="0" height="0"></canvas>
    <canvas id="penCanvas" width="0" height="0"></canvas>
  </section>
  <section class="crop-option">
    <div class="views">
      <p>视角图</p>
      <div class="content">
        <img draggable="true" src="design/images/DIY/img_thumb4.png" data-src="design/images/DIY/img_thumb.png">
        <img draggable="true" src="design/images/DIY/img_thumb5.png" data-src="design/images/DIY/img_thumb2.png">
        <img draggable="true" src="design/images/DIY/img_thumb6.png" data-src="design/images/DIY/img_thumb3.png">
      </div>
    </div>
    <div class="colors">
      <p>填充</p>
      <div class="content">
      <input class="jscolor" value="66ff00" disabled>
      <button class="get-color" disabled>确定</button>
      <button class="apply-color" disabled>应用</button>
        <!-- <span class="color green" data-color="#008000"></span>
        <span class="color red" data-color="#FF0000"></span>
        <span class="color blue" data-color="#0000FF"></span>
        <span class="color orange" data-color="#FFA500"></span>
        <span class="color cyan" data-color="#00FFFF"></span>
        <span class="color black" data-color="#000000"></span>
        <span class="color white" data-color="#FFFFFF"></span>
        <span class="color yellow" data-color="#FFFF00"></span>
        <span class="color gray" data-color="#808080"></span>
        <span class="color brown" data-color="#A52A2A"></span> -->
      </div>
    </div>
  </section>
</div>
<!-- 抠图html结束 -->

<div id="schemaHolder" style="display:none;">
  <div class="schema-inside">
    <canvas id="schemaPreview" width="400" height="300"></canvas>
    <div class="schema-detail">
      <div class="row schema-name-row">
        <label>名称:</label>
        <input type="text" class="schema-name" name="schemaName" required>
      </div>
      <div class="row style-row">
        <label>风格:</label>
        <select class="style" name="style">
        </select>
      </div>
      <div class="row area-row clearfix">
        <label>区域:</label>
        <div class="area">
          <label><input name="space" type="checkbox" vlaue="1"/>客厅</label>
          <label><input name="space" type="checkbox" value="2"/>餐厅</label>
          <label><input name="space" type="checkbox" value="3"/>卧室</label>
          <label><input name="space" type="checkbox" value="4"/>厨房</label>
        </div>
      </div>
      <div class="row space-row">
        <label>适用空间:</label>
        <input class="space" name="space" type="text"/>&nbsp;m<sup style="vertical-align:super;">2</sup>
      </div>
      <div class="row price-row">
        <label>总报价:</label>
        <span class="price"></span>
        <label>提成:</label>
        <span class="divide-money"></span>
      </div>
      <div class="row file360-row">
        <label>全景图片:</label>
        <input class="file360" name="file360" type="text" placeholder="请填写全景图片URL地址"/>
      </div>
      <!-- <div class="row rebate-row">
        <label>优惠:</label>
        <input class="rebate" name="rebate" type="text" style="width:80px;margin-right:3px;"/>元
      </div> -->
    </div>
  </div>
</div>


<div id="schemaDetailHolder" style="display:none;">
  <div class="schema-next">
    <div class="tab">
      <ul>
        <li class="active" data-hash="#tabPC"><a href="javascript:void(0);">电脑端</a></li>
        <li data-hash="#tabMobile"><a href="javascript:void(0);">移动端</a></li>
      </ul>
    </div>
    <div class="tab-body">
      <div class="tab-panel active" id="tabPC">
        <textarea id="description" name="description"></textarea>
      </div>
      <div class="tab-panel" id="tabMobile" style="display:none;">
        <textarea id="mobileDescription" name="mobile_description"></textarea>
      </div>
    </div>
  </div>
</div>
<input type="hidden" class="login_cookie_data" uid="<?php echo $uid?>" username="<?php echo $username?>" refererUrl="<?php echo trig_mvc_route::get_uri('design','init');?>" cookiepre="<?php echo $cookiepre;?>" cookiepath="<?php echo $cookiepath;?>" cookiedomain ="<?php echo $cookiedomain;?>"/>
<input type="hidden" id="schemaInfoHolder" data-name="" data-mcid="" data-price="" data-style="" data-area="" data-space="">


</body>
</html>
