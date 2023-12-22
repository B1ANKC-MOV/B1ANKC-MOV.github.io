/* 站点运行时间 */
function runtime() {
	window.setTimeout("runtime()", 1000);
	/* 请修把这里的建站时间换为你自己的 */
    let startTime = new Date('12/05/2023 16:00:00');
    let endTime = new Date();
    let usedTime = endTime - startTime;
    let days = Math.floor(usedTime / (24 * 3600 * 1000));
    let leavel = usedTime % (24 * 3600 * 1000);
    let hours = Math.floor(leavel / (3600 * 1000));
    let leavel2 = leavel % (3600 * 1000);
    let minutes = Math.floor(leavel2 / (60 * 1000));
    let leavel3 = leavel2 % (60 * 1000);
    let seconds = Math.floor(leavel3 / (1000));
    let runbox = document.getElementById('run-time');
    runbox.innerHTML = '本站已运行<i class="far fa-clock fa-fw"></i> '
        + ((days < 10) ? '0' : '') + days + ' 天 '
        + ((hours < 10) ? '0' : '') + hours + ' 时 '
        + ((minutes < 10) ? '0' : '') + minutes + ' 分 '
        + ((seconds < 10) ? '0' : '') + seconds + ' 秒 ';
}
runtime();
/* 离开当前页面时修改网页标题，回到当前页面时恢复原来标题 */
window.onload = function() {
	var OriginTitile = document.title;
	var titleTime;
	document.addEventListener('visibilitychange', function() {
	  if(document.hidden) {
		$('[rel="icon"]').attr('href', "/foy.ico");
		$('[rel="shortcut icon"]').attr('href', "/foy.ico");
		document.title = '(∪.∪ )...zzz';
		clearTimeout(titleTime);
	  } else {
		$('[rel="icon"]').attr('href', "/foz.ico");
		$('[rel="shortcut icon"]').attr('href', "/foz.ico");
		document.title = 'q(≧▽≦q)';
		titleTime = setTimeout(function() {
		  document.title = OriginTitile;
		}, 2000);
	  }
	});
  }


