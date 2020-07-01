'use strict';
const uniID = require('uni-id')
exports.main = async (event, context) => {
	const payload = await uniID.checkToken(event.uniIdToken)
	if((payload.uid == null)||(payload.uid.length == 0)){
		return {code:1,msg:"用户失去连接,请重新登录"};
	}
	let project = {}
	let id = ''
	const db=uniCloud.database();
	const ban=db.collection('project');
	await ban.where({
		projectCode:event.projectCode
	}).get().then(res=>{
		id = res.data[0]._id;
		project = res.data[0];
	})
	const ban1=db.collection('user-project-role');
	await ban1.add({
	    id:id,
		uid:payload.uid,
		isLeader:false,
		nickName:event.userNickName
	})
	return {code:0,data:project,msg:"加入成功"}
};
