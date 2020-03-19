## 概念

### 可以干什么
> 1、静态资源服务器：可以直接访问静态资源，不需要后台服务参与。        
> 2、API 接口: 可读写数据库，并做全权限控制、缓存。          
> 3、反向代理: 代理应用服务器（负载均衡）。      

如下图：

![](https://raw.githubusercontent.com/wumouren/blog/master/img/nginx1.png)

### 优势

**1、高并发高性能**         
**2、可扩展性好（微内核，可方便二次开发，添加自己功能）**         
> - 轻量：源代码只包含核心模块，其他非核心功能都是通过模块实现，可自由选择        

**3、高可靠性**        
**4、热部署（不需要关机重启，资源直接覆盖就可用）**         
  > - 原理：新版本文件更新后，会将老版本配置添加 old 后缀，继续处理老版本未完成的请求，新的请求会由新的版本接收处理。直至完成所有老版本请求后，则销毁老版配置文件，完全由新版本来接收请求，实现平滑升级。       

**5、开源**         

### 架构及工作流程
#### 架构    
多进程（单线程）和多 IO 复用模型（异步阻塞 IO）。 

#### 工作流程
1）Nginx 在启动后，会有一个 master 进程和多个相互独立的 worker 进程。    
2）接收来自外界的信号，向各 worker 进程发送信号，每个进程都有可能处理这个链接。    
3）master 进程能监控 worker 进程的云运行状态，当 worker 进程异常退出后，会自动重启新的 worker 进程。    

    - worker 数量一般和 CPU 核数一样，worker 数量过多时，会导致频繁切换上下文，影响性能。    
    - 使用多进程模式，不仅能提高并发率，而且进程之间相互独立，一个进程挂掉后，不会影响其他进程。

## 安装（以下操作系统为 CENTOS>=7.0,位数 X64）
### 关闭防火墙
####  关闭 iptables
```
systemctl stop firewalld.service     # 停止防火墙	
systemctl disable firewalld.service  # 永久关闭防火墙	
```
####  确认停用 selinux （SELinux 主要作用就是最大限度地减小系统中服务进程可访问的资源（最小权限原则））
输入 `vi /etc/selinux/config` 命令，修改配置文件
```
# 将 enforcing 改为  disabled
# SELINUX=enforcing
SELINUX=disabled
```

### 安装依赖模块
```
yum  -y install gcc gcc-c++ autoconf pcre pcre-devel make automake
```

### 编辑 `/etc/yum.repos.d/nginx.repo` 文件
```
# 直接粘贴可用
[nginx-stable]
name=nginx stable repo
baseurl=http://nginx.org/packages/centos/$releasever/$basearch/
gpgcheck=1
enabled=1
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true

[nginx-mainline]
name=nginx mainline repo
baseurl=http://nginx.org/packages/mainline/centos/$releasever/$basearch/
gpgcheck=1
enabled=0
gpgkey=https://nginx.org/keys/nginx_signing.key
module_hotfixes=true
```
### 安装 Nginx
```
yum install nginx -y
```

#### [官网链接](https://nginx.org/en/linux_packages.html#stable)   
#### 安装步骤如下：
![](https://raw.githubusercontent.com/wumouren/blog/master/img/nginx2.png)

## 命令

### 启动
```
# 老版
service nginx start

# 新版
systemctl start nginx.service
```

### 重启
```
# 老版
service nginx restart

# 新版
systemctl restart nginx.service
```
### 停止
```
# 老版
service nginx stop

# 新版
systemctl stop nginx.service
```
### 查看状态
```
# 老版
service nginx status

# 新版
systemctl status nginx.service
```
### 重新加载
```
# 老版
nginx -s reload

# 新版
systemctl reload nginx.service
```

### 检验配置文件是否正确
```
nginx -t
```


## 配置

### 基础配置
