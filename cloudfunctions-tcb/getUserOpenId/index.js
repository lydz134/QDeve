'use strict';
exports.main = async (event, context) => {
	const apiUrl = 'https://api.weixin.qq.com/sns/jscode2session';
	const res = await uniCloud.httpclient.request(apiUrl, {
	    method: 'GET',
		dataType:"json",
	    data: {
	      appid:'wx5e390ac905c8a556',
	      secret:'22cc9d003cc8fd514f307758aca70f35',
	      js_code:event.code,
	      grant_type:'authorization_code'
	    },
	})
	return res.data.openid
};
