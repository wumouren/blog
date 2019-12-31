# git 使用的最佳实践总结(for 杜康). 
## 原则
0. 公共分支(共享的)严格禁止force push. 如果force push 会回收权限. 公共分支包括develop和release等.
1. 基于 develop 上做开发, 不建议基于 release 分支上做开发. 每个功能提交后, 开发自己弄到release分支上.
2. 通过 merge request 提交到 develop.
3. 每个 commit 要依据功能, 就是一个功能一个commit. 
4. commit 提交到其他分支(除 develop 外), 推荐使用 cherry pick.
5. 每个 commit 提交 mr 时, 要求已经做过测试, 避免频繁补丁 fixBug.
6. commit 提交的 comment 需要依据规范.
7. cherry pick 使用最原始的 commit , 避免从cherry pick 上做 cherry pick.
8. **pull 的时候要采用 rebase 的方式, 不要使用 merge 的方式.**
9. release分支只接受小功能优化和bug修复. 因为release分支不会走预发流程, 如果提入新功能, 会极大可能引入线上bug.

## 经典流程.
1. git checkout develop;
2. git pull origin develop --rebase;
3. git checkout -b feature01
4. ......coding + commits ...... 
5. git checkout develop
6. git pull origin develop --rebase;
7. git checkout feature01
8. idea上 rebase on develop(git rebase develop)
9. git push origin feature01
10. 在 gitLab 上提交 mr, 从 origin/feature01 到 origin/develop.
11. 找组内同学做代码 review, 有问题 close 当前 mr 或者添加备注，修改后重新提交并再次review. 
    没问题的时候, 由 review 的同学 accept, 并 remove 功能分支.
    
**正在做着 feature01 时, 有个 bug 要修复一下, 可以在commit 当前工作分支时, 切换到develop ,并重复上述过程.**

## develop 向其他分支的提交 
### cherry pick方式
想把 develop 分支上的 99999999 commit 拉到 release01 分支上
1. git checkout release01;
2. git cherry-pick 99999999;

如果不知道 commit 的 ref id, 可以通过 git log 查到.      

## commit 的 comment 规范定义.
格式 `<TYPE>: <DESCRIPTION>[(<VERSION>)][(<AONE_RELATION>)]`
    - TYPE   必填, 从如下值中选择一个:
        - feature  表示功能
        - fix      表示修复bug
        - improve  表示功能改进
        - chore    表示小修改, 不值得一提
        - css      表示界面修改
        - frame    表示非功能性改进
        - cleanup  表示只做了代码格式化, 没有代码逻辑的变更
        - security 表示针对安全规范做的改进
        
    - DESCRIPTION    feature\fix\improve中的description将会被写入release文档, 需要是一句完整的描述.
        - 正确示范:
            - "实例备份策略上增加压缩并行度参数."
        - 错误示范:
            - "修改" , 错误原因: 没说清改什么.
            - "杜康上找不到并行度参数", 错误原因: 将用户的原话直接粘上, 应当做适当修改为一个对功能的正面描述.
            
    - VERSION    选填
    
    - AONE_RELATION    必填, 除非很小很小的功能可以例外. 根据是否能结束一个aone状态, 分为"fix #12345667"和"to #12345677"
    
    举例: 
    - `feature: 增加创建mysql实例的功能.(fix #1234567)`
    - `fix: 修复创建mysql实例时, 选择网络类型为私网时失败的问题.(3750)(fix #2345678)`
        
更新详见 http://gitlab.alibaba-inc.com/rds/dukang


## coding 过程中的推荐实践
1. 常常 pull 远程的代码（经典流程5+6+7+8，可以避免产生额外提交）.
2. 提交前要做 rebase -i 操作, 整理提交的 comment, 尽量保证项目演化的清晰.

## rebase 的使用流程
如果有3个 commit 要压缩为1个, 第四 commit 为 8888888 时:
1. 找到要 rebase 的开始节点, 即第四个 commit 的 ref id = 88888888;
2. git rebase -i 88888888
3. 第一个设置pick , 其余的两个设置为squash.
4. 等待 rebase 结束, 如果要压缩的内容多, 可能时间会较长.

## 一个 简单feature 的提交（代码改动较小时）.
1. git checkout develop;
2. git pull origin develop --rebase;
3. ......coding......
4. git pull origin develop --rebase;
5. git checkout -b feature01
6. git commit .. (注意, commit 之前要建立新分支, 不要提交在本地的 develop 分支上,会污染 developer.)
7. git push origin feature01
8. 在 gitLab 上提交 mr, 从 origin/feature01 到 origin/develop.
9. 找组内同学做代码 review, 有问题 close 当前 mr , 或者添加备注，修改后重新提交并再次review.
    没问题的时候, 由 review 的同学 accept, 并 remove 功能分支.