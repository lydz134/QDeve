'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if((payload.uid == null)||(payload.uid.length == 0)){
		return {code:1,msg:"用户失去连接,请重新登录"};
	}
	const db=uniCloud.database();
	const ban=db.collection('demand');
	await ban.add({
	    demandName:event.demandName,
	    demandDescription:event.demandDescription,
	    projectId:event.projectId,
	    iterationId:event.iterationId,
		memberId:'',
		state:'0',
		finishTime:'',
	})
	return {code:0,msg:"添加成功"};
};
