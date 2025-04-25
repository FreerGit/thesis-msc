import * as FileSystem from 'expo-file-system';

export const saveVC = async (vc, filename, vcJwt) => {
    try {
        console.log("Saving VC:", vc, filename, vcJwt);
        const vcDirectory = `${FileSystem.documentDirectory}vcs/`;
        const dirInfo = await FileSystem.getInfoAsync(vcDirectory);

        if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(vcDirectory, { intermediates: true });
        }

        const fileNames = await FileSystem.readDirectoryAsync(vcDirectory);
        var count = 0;
        for (const name of fileNames) {
            const split = name.split("@@");
            if (split[0] == vc["issuer"]["id"]) {
                count += 1;
            }
        }
        const filePath = `${vcDirectory}${filename}@@${count}.json`;
        await FileSystem.writeAsStringAsync(filePath, JSON.stringify({ "vc": vc, "title": "Example credential", "vcJwt": vcJwt }));

        console.log("VC saved at:", filePath);
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
                    path: filePath,
                    vcJwt: savedVC["vcJwt"],
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

export const findAllVCsByPresentationRequest = async (constraints: any[]) => {
    try {
        const vcs = await listAllVCs();

        const results = vcs.filter(vc => {
            return constraints.every(constraint => {
                return constraint.path.some((path: string) => {
                    const correctPath = path.replace(/^\$\./, "");
                    const value = getValueByPath(vc.vc, correctPath);

                    if (value) {
                        console.log("Value:", value);
                        console.log("Constraint:", constraint);
                        console.log("Correct Path:", correctPath);
                        console.log("Regex Pattern:", constraint.pattern);
                        const regex = new RegExp(constraint.pattern);
                        const match = regex.test(value);
                        console.log("Match:", match);
                        return match;
                    }

                    return false;
                });
            });
        });

        console.log("Filtered VCs:", JSON.stringify(results, null, 2));

        return results;
    } catch (error) {
        console.error('Error finding VCs by presentation request:', error);
    }
}

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

const getValueByPath = (obj: any, path: string) => {
    return path.split('.').reduce((acc, key) => acc && acc[key], obj);
};