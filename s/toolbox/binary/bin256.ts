
// import {decodeHex, encodeHex} from "./hex.js"

// export function bin256(lingo: string) {
// 	const bigBase = BigInt(lingo.length)

// 	function bigToBinary(big: bigint): ArrayBuffer {
// 		const hex = big.toString(16)
// 		return decodeHex(hex)
// 	}

// 	function bigFromBinary(binary: ArrayBuffer): bigint {
// 		const hex = encodeHex(binary)
// 		return BigInt("0x" + hex)
// 	}

// 	{
// 		function encode(binary: ArrayBuffer) {
// 			const recurse = (value: bigint): string =>
// 				value < bigBase
// 					? lingo[Number(value)]
// 					: recurse(value / bigBase) + lingo[Number(value % bigBase)]
// 			const big = bigFromBinary(binary)
// 			return recurse(big)
// 		}

// 		function decode(text: string) {
// 			let sum = 0n
// 			let step = 1n

// 			for (let i = text.length - 1; i >= 0; i--) {
// 				const index = BigInt(lingo.indexOf(text[i]))
// 				if (index == -1n)
// 					throw new Error("invalid base42 character")
// 				sum += step * index
// 				step *= bigBase
// 			}
		
// 			return bigToBinary(sum)
// 		}
		
// 		const length = encode(new ArrayBuffer(32)).length
		
// 		function is(text: string) {
// 			const correctLength = text.length === length

// 			if (!correctLength)
// 				return false

// 			let correctCharacters = true
// 			{
// 				const allowedCharacters = [...lingo]
// 				for (const character of [...text]) {
// 					if (!allowedCharacters.includes(character))
// 						correctCharacters = false
// 				}
// 			}

// 			return correctCharacters
// 		}

// 		return {encode, decode, is, bigToBinary, bigFromBinary}
// 	}
// }

// export const base42 = bin256("256789BCDFGHJKMNPRSTWXYZbcdfghkmnpqrstwxyz")
// export const base39 = bin256("256789CDFHJKMNPRTWXYZbcdfghkmnpqrstwxyz")
// export const base32 = bin256("256789CDFHJKNRWXYZbcdfghknqrwxyz")

// export function b256(lingo: string) {
// 	const lingoLength = lingo.length

// 	// function enc(bytes: Uint8Array) {
// 	// 		let digits = [],   //the array for storing the stream of base58 digits
// 	// 			result = "",   //the result string variable that will be returned
// 	// 			digitIndex: number,        //the iterator variable for the base58 digit array (d)
// 	// 			carry: number,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
// 	// 			n;        //a temporary placeholder variable for the current base58 digit
// 	// 		bytes.forEach((byte, byteIndex) => {
// 	// 			digitIndex = 0,                           //reset the base58 digit iterator
// 	// 			carry = bytes[byteIndex];                        //set the initial carry amount equal to the current byte amount
// 	// 			result += carry || result.length ^ byteIndex ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
// 	// 			while(digitIndex in digits || carry) {             //start looping through the digits until there are no more digits and no carry amount
// 	// 					n = digits[digitIndex];                    //set the placeholder for the current base58 digit
// 	// 					n = n ? n * 256 + carry : carry;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
// 	// 					carry = n / lingoLength | 0;              //find the new carry amount (floored integer of current digit divided by 58)
// 	// 					digits[digitIndex] = n % lingoLength;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
// 	// 					digitIndex++                          //iterate to the next base58 digit
// 	// 			}
// 	// 		})
// 	// 		// for(byteIterator in bytes) { //loop through each byte in the input stream
// 	// 		// }
// 	// 		while(digitIndex--)        //since the base58 digits are backwards, loop through them in reverse order
// 	// 				result += lingo[digits[digitIndex]]; //lookup the character associated with each base58 digit
// 	// 		return result          //return the final base58 string
// 	// }

// 	var to_b58 = function(
// 			B,            //Uint8Array raw byte input
// 	) {
// 			var d = [],   //the array for storing the stream of base58 digits
// 					s = "",   //the result string variable that will be returned
// 					i,        //the iterator variable for the byte input
// 					j,        //the iterator variable for the base58 digit array (d)
// 					c,        //the carry amount variable that is used to overflow from the current base58 digit to the next base58 digit
// 					n;        //a temporary placeholder variable for the current base58 digit
// 			for(i in B) { //loop through each byte in the input stream
// 					j = 0,                           //reset the base58 digit iterator
// 					c = B[i];                        //set the initial carry amount equal to the current byte amount
// 					s += c || s.length ^ i ? "" : 1; //prepend the result string with a "1" (0 in base58) if the byte stream is zero and non-zero bytes haven't been seen yet (to ensure correct decode length)
// 					while(j in d || c) {             //start looping through the digits until there are no more digits and no carry amount
// 							n = d[j];                    //set the placeholder for the current base58 digit
// 							n = n ? n * 256 + c : c;     //shift the current base58 one byte and add the carry amount (or just add the carry amount if this is a new digit)
// 							c = n / lingoLength | 0;              //find the new carry amount (floored integer of current digit divided by 58)
// 							d[j] = n % lingoLength;               //reset the current base58 digit to the remainder (the carry amount will pass on the overflow)
// 							j++                          //iterate to the next base58 digit
// 					}
// 			}
// 			while(j--)        //since the base58 digits are backwards, loop through them in reverse order
// 					s += lingo[d[j]]; //lookup the character associated with each base58 digit
// 			return s          //return the final base58 string
// 	}

// 	var from_b58 = function(
// 			S,            //Base58 encoded string input
// 	) {
// 			var d = [],   //the array for storing the stream of decoded bytes
// 					b = [],   //the result byte array that will be returned
// 					i,        //the iterator variable for the base58 string
// 					j,        //the iterator variable for the byte array (d)
// 					c,        //the carry amount variable that is used to overflow from the current byte to the next byte
// 					n;        //a temporary placeholder variable for the current byte
// 			for(i in S) { //loop through each base58 character in the input string
// 					j = 0,                             //reset the byte iterator
// 					c = lingo.indexOf( S[i] );             //set the initial carry amount equal to the current base58 digit
// 					if(c < 0)                          //see if the base58 digit lookup is invalid (-1)
// 							return undefined;              //if invalid base58 digit, bail out and return undefined
// 					c || b.length ^ i ? i : b.push(0); //prepend the result array with a zero if the base58 digit is zero and non-zero characters haven't been seen yet (to ensure correct decode length)
// 					while(j in d || c) {               //start looping through the bytes until there are no more bytes and no carry amount
// 							n = d[j];                      //set the placeholder for the current byte
// 							n = n ? n * lingoLength + c : c;        //shift the current byte 58 units and add the carry amount (or just add the carry amount if this is a new byte)
// 							c = n >> 8;                    //find the new carry amount (1-byte shift of current byte value)
// 							d[j] = n % 256;                //reset the current byte to the remainder (the carry amount will pass on the overflow)
// 							j++                            //iterate to the next byte
// 					}
// 			}
// 			while(j--)               //since the byte array is backwards, loop through it in reverse order
// 					b.push( d[j] );      //append each byte to the result
// 			return new Uint8Array(b) //return the final byte array in Uint8Array format
// 	}

// 	function encode(binary: ArrayBuffer) {
// 		const bytes = new Uint8Array(binary)
// 		return to_b58(bytes)
// 	}

// 	function decode(text: string) {
// 		return from_b58(text)
// 	}

// 	return {encode, decode}
// }

// export const bastard = b256("256789CDFHJKMNPRTWXYZbcdfghkmnpqrstwxyz")
// // export const bastard = b256("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz")

// // 256789CDFHJKMNPRTWXYZbcdfghkmnpqrstwxyz
// // 0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ

// // 0123456789abcdefghijklmnopqrstuvwxyz
// // 0123456789bcdfghjklmnpqrstuvwxyz

// // 256789abcdefghijklmnopqrstuvwxyz
// // 256789abcdefghijklmnopqrstuvwxyz


// export function rehex(customLingo: string) {
// 	const hexLingo = "0123456789abcdef"
// 	if (customLingo.length !== hexLingo.length)
// 		throw new Error(`rehex: custom lingo has length ${customLingo.length} when ${hexLingo.length} is required`)

// 	function encode(binary: ArrayBuffer) {
// 		const hex = encodeHex(binary)
// 		return [...hex]
// 			.map(character => customLingo[hexLingo.indexOf(character)])
// 			.join("")
// 	}

// 	function decode(text: string) {
// 		const hex = [...text]
// 			.map(character => {
// 				const index = customLingo.indexOf(character)
// 				if (index === -1)
// 					throw new Error(`rehex: decode encountered an unknown character "${character}"`)
// 				return hexLingo[index]
// 			})
// 			.join("")
// 		return decodeHex(hex)
// 	}

// 	return {encode, decode}
// }

// // 0123456789abcdef
// // 279cdfhknpqrwxyz
// // 23456789dkqrwxyz

// export const althex = rehex("279cdfhknpqrwxyz")
