
1.确保已经安装有ionic 和cordova
npm install ionic cordova -g
2.到这里，环境安装的差不多了，可以进行打包了
执行添加安装平台的命令
cordova platform add android
打包项目
ionic cordova build android --prod --release

	移除android工程：ionic cordova platform remove android
	使用命令 --nofetch 安装：cordova platform add android --nofetch
	ionic cordova platform add android@7.1.0 --prod --release
	ionic cordova platform add android@6.4.0
	ionic cordova platform add android@6.4.0 --prod --release

增加签名
jarsigner -verbose -keystore mgiles.keystore -signedjar D:\work\ionic\mgi-pda\platforms\android\app\build\outputs\apk\release\appRelease7.1.0.apk D:\work\ionic\mgi-pda\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk mgiles.keystore
