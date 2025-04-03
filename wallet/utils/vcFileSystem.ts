import * as FileSystem from 'expo-file-system';

export const saveVC = async (vc, filename) => {
    try {

        const vcDirectory = `${FileSystem.documentDirectory}vcs/`;
        console.log(vcDirectory)
        const dirInfo = await FileSystem.getInfoAsync(vcDirectory);

        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(vcDirectory, { intermediates: true });
        }

        const fileNames = await FileSystem.readDirectoryAsync(vcDirectory);
        var count = 0;
        for (const name in fileNames) {
            const split = name.split("@@");
            console.log(split)
            if (split[0] == vc["credentialSubject"]["id"]) {
                count += 1;
            }
        }
        console.log(count)
        const filePath = `${vcDirectory}${filename}@@${count}.json`;
        console.log(filePath)
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
                results.push({
                    vc: JSON.parse(content),
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