*Neighborhood app
1. 用浏览器打开index.html 运行应用
2.左边通过下拉菜单筛选地点类型，默认情况下显示通过Google Search Neighbor得到的20个地点
3.单击显示的地点按钮会在地图上弹出information window显示streetview，以及通过NY Times API搜索出得一条相关新闻链接。
4.点击地图中的marker ，会弹出相应的information window。
5.鼠标划过marker，颜色会发生改变。
6.使用knockout 管理了筛选出来的的列表信息，以及选择的筛选类型，
7. 利用JQUERY的getJSON获取了第三方API数据，并且用.error的方式处理获取失败的情况
8. 修改了NYtimes API服务功能。
