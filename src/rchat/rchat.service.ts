import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class RchatService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager
    ) { }

    async testeCache() {
        //await this.cacheManager.set('teste', 'PEDRO');
    }

    async sendMessage(data) {
        if (
            data.messages[0].username == process.env.ROCKETCHAT_MEDIA_SENDER ||
            data.type == 'LivechatSession'
        ) {
            return;
        }

        var messageId = data.messages[0]._id;
        var message = data.messages[0].msg;
        var guestPhone = data.label.split('-')[0].trim();
        var department = data.visitor.department;
        var room_id = data._id;

        if (data.messages[0].closingMessage) {
            axios.post(`${process.env.WHATSAPP}/closeclearchat`, {
                guestNumber: guestPhone,
                roomId: room_id
            }).then(() => {
                console.log(`Chat ${guestPhone} finalizado`);
            })
        }

        if (data.messages[0].attachments) {
            var image = {
                url: data.messages[0].fileUpload.publicFilePath,
                description: data.messages[0].attachments[0].description
            }
        }

        // if ((guestPhone != '5585994195971') && (guestPhone != '5585999847522') && (guestPhone != '5585999959655')) {
        //     return;
        // }

        console.log(data);


        var sentedMessages = await this.cacheManager.get(`rw_messages_${guestPhone}`);

        var alreadySented = await this.alreadySented(sentedMessages, messageId);

        if (alreadySented) {
            console.log('Mensagem já enviada. Evitando duplicidade.');
            return;
        }

        var cached = await this.storeMessagesOnCache(sentedMessages, messageId, guestPhone);

        console.log('Cached: ', cached);

        if (message) {
            //message = `webhook - ${message}`;
            await this.zenviaSendText(message, guestPhone);
        }

        if (image) {
            this.zenviaSendFile(image.url, guestPhone).then(() => {
                //image.description = `webhook - ${image.description}`;
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
