'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if((payload.uid == null)||(payload.uid.length == 0)){
		return {code:1,msg:"用户失去连接,请重新登录"};
	}
	const db=uniCloud.database();
	const ban=db.collection('demand');
	await ban.doc(event._id).update({
		state:event.state,
		finishTime:event.finishTime
	});
	return {code:0,msg:"修改成功"}
};
