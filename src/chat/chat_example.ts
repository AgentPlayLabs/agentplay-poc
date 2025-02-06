import { MultiAgentChat } from './multi_agent_chat';
import { DatabaseAdapter, UUID } from '@elizaos/core';
import { v4 as uuidv4 } from 'uuid';

async function runChatExample(databaseAdapter: DatabaseAdapter<any>) {
    // 创建聊天管理器
    const chat = new MultiAgentChat(databaseAdapter);

    // 创建聊天室
    await chat.createChatRoom();

    // 创建参与者
    const trump: UUID = uuidv4();
    const cnLao: UUID = uuidv4();

    // 添加参与者
    await chat.addParticipant({
        id: trump,
        name: "Donald Trump",
        role: "host"
    });

    await chat.addParticipant({
        id: cnLao,
        name: "Chinese Elder",
        role: "participant"
    });

    // 发送一些消息
    await chat.sendMessage(trump, "China, China, China! They're taking our jobs!");
    await chat.sendMessage(cnLao, "年轻人不讲武德，来骗，来偷袭！");
    await chat.sendMessage(trump, "Nobody knows more about jobs than me, believe me!");
    
    // 获取所有消息
    const messages = await chat.getMessages();
    console.log("Chat messages:");
    messages.forEach(msg => {
        const sender = msg.agentId === trump ? "Trump" : "Chinese Elder";
        console.log(`${sender}: ${msg.content}`);
    });

    // 获取参与者列表
    const participants = await chat.getParticipants();
    console.log("\nChat participants:");
    participants.forEach(p => {
        console.log(`${p.name} (${p.role})`);
    });

    // 清理聊天室
    await chat.cleanup();
}

// 示例用法
// runChatExample(yourDatabaseAdapter);
