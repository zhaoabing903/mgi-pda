
# 发布说明

## 发布web服务器

- 1 删除根目录下www内容
- 2 执行命令：ionic build --prod -- --base-href=/pda/
- 3 将生成的www压缩，上传至远程服务器
- 4 删除服务器上对应的站点目录下内容，将上传的新文件解压至此目录，发布完成

## 1.确保已经安装有ionic 和cordova

npm install ionic cordova -g

## 2.到这里，环境安装的差不多了，可以进行打包了

执行添加安装平台的命令
cordova platform add android
打包项目
ionic cordova build android --prod --release

### 移除android工程：ionic cordova platform remove android

### 使用命令 --nofetch 安装：cordova platform add android --nofetch

### ionic cordova platform add android@7.1.0 --prod --release

### ionic cordova platform add android@6.4.0

### ionic cordova platform add android@6.4.0 --prod --release

## 3.增加签名

jarsigner -verbose -keystore mgiles.keystore -signedjar D:\Work\GitHub\mgi-pda\platforms\android\app\build\outputs\apk\release\appRelease7.1.0.apk D:\Work\GitHub\mgi-pda\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk mgiles.keystore
