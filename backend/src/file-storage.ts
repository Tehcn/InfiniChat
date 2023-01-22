import { ShareServiceClient } from '@azure/storage-file-share'
import { exec } from 'child_process';
import { existsSync, writeFile, opendirSync } from 'fs';
import { url } from 'inspector';

const connStr = process.env['AZURE_FILE_SHARE_ACCESS_KEY_CONNECTION_STRING']!;
const serviceClient = ShareServiceClient.fromConnectionString(connStr);
const shareClient = serviceClient.getShareClient('icons')

export namespace Upload {
    // returns cdn endpoint for file
    export const profileIcon = async (id: number, file: File) => {
        if (file.size > 2 ** 16) throw new Error('File too large!');
        else if (file.type != 'image/x-png') {
            throw new Error('File must be in .png format!');
        } else {
            let dir = shareClient.getDirectoryClient('profile_icons');
            let url = dir.createFile(`${id}.png`, file.size)
                .then(({ fileClient, fileCreateResponse }) => {
                    fileClient.uploadData(file);
                    return fileClient.url
                })
            return url;
        }
    }

    export const serverIcon = async (id: number, file: File) => {
        if (file.size > 2 ** 16) throw new Error('File too large!');
        else if (file.type != 'image/x-png') {
            throw new Error('File must be in .png format!');
        } else {
            let dir = shareClient.getDirectoryClient('server_icons');
            let url = dir.createFile(`${id}.png`, file.size)
                .then(({ fileClient, fileCreateResponse }) => {
                    fileClient.uploadData(file);
                    return fileClient.url
                })
            return url;
        }
    }
}