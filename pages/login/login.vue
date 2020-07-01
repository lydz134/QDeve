<template>
    <view>
        <page-head :title="title"></page-head>
        <view class="uni-padding-wrap" style="margin-top:250rpx;">
			<view style="background:#FFF; padding:20upx;">
			    <block v-if="hasLogin === true">
			        <view class="uni-h3 uni-center uni-common-mt">已登录</view>
			        <view class="uni-hello-text uni-center">
						请点击按钮登录
			        </view>
			    </block>
			    <block v-if="hasLogin === false">
			        <view class="uni-h3 uni-center uni-common-mt">未登录</view>
			        <view class="uni-hello-text uni-center">
			            请点击按钮登录
			        </view>
			    </block>
			</view>
            <view class="uni-btn-v uni- uni-common-mt">
				<block v-if="hasLogin == false">
        			<!-- #ifdef MP-TOUTIAO -->
        			<button type="primary" class="page-body-button" style="background-color: #07abf5;color: white;" open-type="getUserInfo" v-for="(value,key) in providerList" @click="tologin(value)"
        			    :key="key">
        			    登录
        			</button>
        			<!-- #endif -->
        			<!-- #ifndef MP-TOUTIAO -->
        			<button type="primary" class="page-body-button" style="background-color: #07abf5;color: white;" open-type="getUserInfo" v-for="(value,key) in providerList" @click="tologin(value)"
        				:key="key">{{value.name}}</button>
        			<!-- #endif -->
        		</block>
				<block v-if="hasLogin == true">
					<!-- #ifndef MP-TOUTIAO -->
					<button type="primary" class="page-body-button" style="background-color: #07abf5;color: white;" open-type="getUserInfo" @click="reLaunchHomePage()"
						:key="key">返回首页</button>
					<!-- #endif -->
				</block>
            </view>
        </view>
    </view>
</template>
<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'

    export default {
        data() {
            return {
                title: 'login',
                providerList: [],
				userInfo: {}
            }
        },
        computed: {
            ...mapState(['hasLogin','firstLogin'])
        },
        onLoad() {
			if(this.hasLogin == true){
				this.reLaunchHomePage();
			}
            uni.getProvider({
                service: 'oauth',
                success: (result) => {
                    this.providerList = result.provider.map((value) => {
                        let providerName = '';
                        switch (value) {
                            case 'weixin':
                                providerName = '微信登录'
                                break;
                            case 'qq':
                                providerName = 'QQ登录'
                                break;
                            case 'sinaweibo':
                                providerName = '新浪微博登录'
                                break;
                            case 'xiaomi':
                                providerName = '小米登录'
                                break;
                            case 'alipay':
                                providerName = '支付宝登录'
                                break;
                            case 'baidu':       
                                providerName = '百度登录'
                                break;
                            case 'toutiao':
                                providerName = '头条登录'
                                break;
                            case 'apple':
                                providerName = '苹果登录'
                                break;
                        }
                        return {
                            name: providerName,
                            id: value
                        }
                    });

                },
                fail: (error) => {
                    console.log('获取登录通道失败', error);
                }
            });
        },
        methods: {
            ...mapMutations(['login','logout']),
            tologin(provider) {
                uni.login({
                	provider: provider.id,
                	// #ifdef MP-ALIPAY
                	scopes: 'auth_user', //支付宝小程序需设置授权类型
                	// #endif
                	success: (res) => {
                		// 更新保存在 store 中的登录状态
                		this.login(provider.id);      
						uniCloud.callFunction({
						    name: 'getToken',
						    data: {
								code:res.code
							},  
						    success(result){
								try {
								    uni.setStorageSync('uniIdToken', result.result.token);
								} catch (e) {
								    // error
								}
							}
						});
						this.reLaunchHomePage();	
                	},
                	fail: (err) => {
                		console.log('login fail:', err);
                	}
                });
            },
			reLaunchHomePage(){
				uni.navigateTo({
				    url: '../homepage/homepage'
				});
			}
        }
    }
</script>

<style>

</style>
