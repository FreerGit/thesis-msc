import * as FileSystem from 'expo-file-system';

export const saveVC = async (vc, filename) => {
    try {
        const vcDirectory = `${FileSystem.documentDirectory}vcs/`;
        const dirInfo = await FileSystem.getInfoAsync(vcDirectory);

        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(vcDirectory, { intermediates: true });
        }

        const fileNames = await FileSystem.readDirectoryAsync(vcDirectory);
        var count = 0;
        for (const name of fileNames) {
            const split = name.split("@@");
            if (split[0] == vc["vc"]["credentialSubject"]["id"]) {
                count += 1;
            }
        }
        const filePath = `${vcDirectory}${filename}@@${count}.json`;
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify(vc));

        return filePath;
    } catch (error) {
        console.error('Error saving VC:', error);
        throw error;
    }
};

export const retrieveVC = async (filePath) => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
            return null;
        }

        const fileContent = await FileSystem.readAsStringAsync(filePath);
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error retrieving VC:', error);
        return null;
    }
};

export const listAllVCs = async () => {
    try {
        const vcDirectory = `${FileSystem.documentDirectory}vcs/`;
        const dirInfo = await FileSystem.getInfoAsync(vcDirectory);

        if (!dirInfo.exists) {
            return [];
        }

        const files = await FileSystem.readDirectoryAsync(vcDirectory);
        const results = [];

        for (const file of files) {
            const filePath = `${vcDirectory}${file}`;
            try {
                const content = await FileSystem.readAsStringAsync(filePath);
                const savedVC = JSON.parse(content);
                results.push({
                    title: savedVC["title"],
                    vc: savedVC["vc"],
                    path: filePath
                });
            } catch (err) {
                console.error(`Error reading file ${file}:`, err);
            }
        }

        return results;
    } catch (error) {
        console.error('Error listing VCs:', error);
        return [];
    }
};

export const deleteVC = async (filePath) => {
    try {
        const fileInfo = await FileSystem.getInfoAsync(filePath);
        if (!fileInfo.exists) {
            return false;
        }

        await FileSystem.deleteAsync(filePath);
        return true;
    } catch (error) {
        console.error('Error deleting VC:', error);
        return false;
    }
};