<template>
	<view>
		<page-head :title="title"></page-head>
		<view class="uni-padding-wrap">
			<view :animation="animationData" class="personal-info">
				<block v-if="hasUserInfo === true">
					<view style="padding:30upx 0;text-align:center;">
						<image class="userinfo-avatar" :src="userInfo.avatarUrl"></image>
					</view>
					<view class="uni-h4 uni-center uni-common-mt">{{userInfo.nickName || userInfo.email}}</view>
				</block>
			</view>
			<uni-list >
				<uni-list-item :animation="animationData" :show-arrow="false" @click="togglePopup('center', 'createProject')" class="uni-center uni-hide" title="创建项目" />
				<uni-list-item :animation="animationData" :show-arrow="false" @click="togglePopup('center', 'joinProject')" class="uni-center uni-hide" title="加入项目" />
			</uni-list>
			<view style="width: 100%;height:94rpx;">
				<text> </text>
			</view>
		</view>
		<view class="my-tabbar" @click="enterMyProjectPage">
			<view class="my-tab">我的项目</view>
		</view>
		<uni-popup :animation="false" ref="createProject" :type="type" :mask-click="false">
			<view class="uni-tip">
				<input class="uni-tip-content" type="text" v-model="projectName" placeholder="项目名称" />
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('createProject')">取消</text>
					<text class="uni-tip-button" @click="confirm('createProject')">确定</text>
				</view>
			</view>
		</uni-popup>
		<uni-popup :animation="false" ref="joinProject" :type="type" :mask-click="false">
			<view class="uni-tip">
				<input class="uni-tip-content" type="text" v-model="projectCode" placeholder="项目邀请码" />
				<view class="uni-tip-group-button">
					<text class="uni-tip-button" @click="cancel('joinProject')">取消</text>
					<text class="uni-tip-button" @click="confirm('joinProject')">确定</text>
				</view>
			</view>
		</uni-popup>
	</view> 
</template>
<script>
	import uniList from '../../components/uni-list/uni-list.vue' 
	import uniListItem from '../../components/uni-list-item/uni-list-item.vue' 
	import uniPopup from '../../components/uni-popup/uni-popup.vue' 
	import {
		mapState,
		mapMutations,
	} from 'vuex'

	export default {
		components: {
			uniList,
			uniListItem,
			uniPopup
		},
		data() {
			return {
				type: '',
				title: 'getUserInfo',
				hasUserInfo: false,
				userInfo: {},
				animationData: {},
				projectName: '',
				projectCode: ''
			}
		},
		computed: {
			...mapState(['hasLogin']),
			...mapState({
				loginProvider: state => state.loginProvider
			})
		},
		onLoad() {
			if(this.hasLogin == false){
				console.info(this.hasLogin)
				uni.navigateTo({
				    url: '../login/login'
				});
			}
			uni.getUserInfo({
				provider: this.loginProvider,
				success: (result) => {
					console.log('getUserInfo success', result);
					this.hasUserInfo = true;
					this.userInfo = result.userInfo;
				},
				fail: (error) => {
					console.log('getUserInfo fail', error);
					let content = error.errMsg;
					if (~content.indexOf('uni.login')) {
						content = '请在登录页面完成登录操作';
					}
			        // #ifndef APP-PLUS
					uni.getSetting({
						success: (res) => {
							let authStatus = res.authSetting['scope.userInfo'];
							if (!authStatus) {
								uni.showModal({
									title: '授权失败',
									content: 'Hello uni-app需要获取您的用户信息，请在设置界面打开相关权限',
									success: (res) => {
										if (res.confirm) {
											uni.openSetting()
										}
									}
								})
							} else {
								uni.showModal({
									title: '获取用户信息失败',
									content: '错误原因' + content,
									showCancel: false
								});
							}
						}
					})
			        // #endif
			        // #ifdef APP-PLUS
			        uni.showModal({
			        	title: '获取用户信息失败',
			        	content: '错误原因' + content,
			        	showCancel: false
			        });
			        // #endif
				}
			});
		},
		onShow() {
			var animation = uni.createAnimation({
				duration:1000,
				timingFunction: 'ease',
			})
			this.animation = animation
			setTimeout(function() {
			  animation.opacity(1).step()
			  this.animationData = animation.export()
			}.bind(this), 1000)
		},
		methods:{
			...mapMutations(['setIsLeader','setProject']),
			togglePopup(type, open) {
				this.projectName = ''
				this.projectCode = ''
				this.type = type
				this.$nextTick(() => {
					this.$refs[open ].open()
				})
			},
			cancel(type) {
				this.$refs[type].close()
			},
			confirm(type,e) {
				let th = this
				try {
				    const uniIdToken = uni.getStorageSync('uniIdToken');
				} catch (e) {
				    // error
				}
				switch(type){
					case 'joinProject':
						uniCloud.callFunction({
						    name: 'joinProject',
						    data: {
								uniIdToken:this.uniIdToken,
								projectCode:this.projectCode,
								userNickName:this.userInfo.nickName
							},  
						    success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								});
								uni.navigateTo({
								    url: '../projectpage/projectpage',
									success() {
										th.setIsLeader(false)
										th.setProject(res.result.data)
									}
								});
							}
						});
						break;
					case  'createProject':
						uniCloud.callFunction({
						    name: 'addProject',
						    data: {
								uniIdToken:this.uniIdToken,
								projectName:this.projectName,
								userNickName:this.userInfo.nickName
							},  
						    success(res){
								uni.showToast({
									title: res.result.msg,
									duration: 2000
								}); 
								uni.navigateTo({
								    url: '../projectpage/projectpage',
									success() {
										th.setIsLeader(true)
										th.setProject(res.result.data)
									}
								});
								
							}
						});
						break;
				}
				this.$refs[type].close()
			},
			enterMyProjectPage(){
				uni.navigateTo({
				    url: '../myprojectpage/myprojectpage'
				});
			}
		}
		
	}
</script>

<style>
	.my-tabbar{
		background:#FFF; 
		background-color: white; 
		width: 100%;
		bottom: 0;
		border-top: 1rpx solid #e2e2e2;
		position: fixed;
	}
	.my-tab{
		width: 100%;
		padding: 24rpx 0;
		font-size: 30rpx;
		cursor: pointer;
		float: left;
		text-align: center;
	}
	.personal-info{
		opacity: 0;
		background:#FFF; 
		padding:40rpx;
		border-bottom: 1rpx solid #e2e2e2;
	}
	.userinfo-avatar {
		border-radius: 128upx;
		width: 128upx;
		height: 128upx;
	}
	/* 提示窗口 */
	.uni-tip {
		/* #ifndef APP-NVUE */
		display: flex;
		flex-direction: column;
		/* #endif */
		padding:30px 15px 15px 15px;
		width: 250px;
		background-color: #fff;
		border-radius: 10px;
	}
	.uni-tip-content {
		color: black;
		padding: 10px 0;
		font-size: 15px;
		border: 1px solid #e2e2e2;
		border-radius: 5px;
		text-align: center;
	}
	.uni-tip-group-button {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		margin-top: 20px;
	}
	.uni-tip-button {
		flex: 1;
		text-align: center;
		font-size: 14px;
		color: #3b4144;
	}
</style>
