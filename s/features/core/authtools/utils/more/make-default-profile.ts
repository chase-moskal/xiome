
export const makeDefaultProfile = (userId: string, generateNickname: () => string) => ({
	userId,
	tagline: "",
	avatar: undefined,
	nickname: generateNickname(),
})
