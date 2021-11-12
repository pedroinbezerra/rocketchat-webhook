import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RchatService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager
    ) { }

    async sendMessage(data) { 
        var guestPhone = data.label.split('-')[0].trim();

        if (data.messages[0].closingMessage) {          
            axios.post(`${process.env.WHATSAPP}/closeclearchat`, {
                guestNumber: guestPhone,
                roomId: room_id
            }).then(() => {
                console.log(`Atendimento finalizado\n`);
                console.log(`Departamento: ${data.visitor.department}\nSala: ${data._id}`);
                console.log(`Guest: ${data.label}\nAgente: ${`${data.agent.name} - ${data.agent.username}`}`);
                console.log('\n**************************');
            })

            return;
        }

        if (
            data.messages[0].username == process.env.ROCKETCHAT_MEDIA_SENDER ||
            data.type == 'LivechatSession' || data.closer
        ) {
            return;
        }

        var messageId = data.messages[0]._id;
        var message = data.messages[0].msg;
        var guestPhone = data.label.split('-')[0].trim();
        var department = data.visitor.department;
        var room_id = data._id;
        var agent = `${data.agent.name} - ${data.agent.username}`;

        if (data.messages[0].attachments) {
            var image = {
                url: data.messages[0].fileUpload.publicFilePath,
                description: data.messages[0].attachments[0].description
            }
        }

        var sentedMessages = await this.cacheManager.get(`rw_messages_${guestPhone}`);
        var alreadySented = await this.alreadySented(sentedMessages, messageId);

        if (alreadySented) {
            console.log('Mensagem já enviada. Evitando duplicidade.');
            return;
        }

        console.log(`Enviando mensagem\n`);
        console.log(`Departamento: ${department}\nSala: ${room_id}`);
        console.log(`Guest: ${data.label}\nAgente: ${agent} ${message ? '\nMensagem: ' + message : ''}   `);

        if (data.messages[0].file) {
            var file = data.messages[0].file;
            var fileUpload = data.messages[0].fileUpload;
            console.log(`Tipo: ${file.type}\nNome: ${file.name}\nTamanho: ${fileUpload.size}`);
            console.log(`URL: ${fileUpload.publicFilePath}`);
            console.log(data.messages[0].attachments[0].description ? `Descrição: ${data.messages[0].attachments[0].description}` : '');

        }

        var cached = await this.storeMessagesOnCache(sentedMessages, messageId, guestPhone);

        console.log('\nCached: ', cached);

        if (message) {
            await this.zenviaSendText(message, guestPhone);
        }

        if (image) {
            this.zenviaSendFile(image.url, guestPhone).then(() => {
                if (image.description) {
                    this.zenviaSendText(image.description, guestPhone);
                }
            });
        }
    }

    async alreadySented(sentedMessages: string, messageId: string) {
        if (sentedMessages) {
            var sentedMessagesArray = sentedMessages.split(',');
        }

        if (sentedMessagesArray && sentedMessagesArray.indexOf(messageId) != -1) {
            return true;
        }

        return false;
    }

    async storeMessagesOnCache(sentedMessages: string, incommingMessageId: string, guestPhone: string) {
        await this.cacheManager.set('teste', 'PEDRO');

        if (sentedMessages) {
            sentedMessages = sentedMessages + `,${incommingMessageId}`;
            return await this.cacheManager.set(`rw_messages_${guestPhone}`, sentedMessages)
        } else {
            return await this.cacheManager.set(`rw_messages_${guestPhone}`, incommingMessageId);
        }
    }

    async zenviaSendText(message: string, guestPhone: string) {
        const payload = {
            from: process.env.ZENVIA_BOT,
            to: guestPhone,
            contents: [{ type: 'text', text: message }]
        };

        const httpOpts = {
            headers: { 'X-API-TOKEN': process.env.ZENVIA_TOKEN }
        };

        var zenviaReturn = await axios.post(
            'https://api.zenvia.com/v2/channels/whatsapp/messages',
            payload,
            httpOpts
        )

        if (process.env.ZENVIA_LOGS_URL) {
            axios.post(
                process.env.ZENVIA_LOGS_URL,
                zenviaReturn
            )
        }

        if (zenviaReturn?.status == 200) {
            console.log(`\nEnviado com sucesso pela Zenvia: ${zenviaReturn.data.id}`);
            console.log('\n**************************');
        }
    }

    async zenviaSendFile(fileUrl: string, guestPhone: string) {
        const payload = {
            from: process.env.ZENVIA_BOT,
            to: guestPhone,
            contents: [{ type: 'file', fileUrl: fileUrl }]
        };

        const httpOpts = {
            headers: { 'X-API-TOKEN': process.env.ZENVIA_TOKEN }
        };

        var zenviaReturn = await axios.post(
            'https://api.zenvia.com/v2/channels/whatsapp/messages',
            payload,
            httpOpts
        )

        if (process.env.ZENVIA_LOGS_URL) {
            axios.post(
                process.env.ZENVIA_LOGS_URL,
                zenviaReturn
            )
        }
    }
}
