export const createUniqueIdFromDevice = (device: any) => {
    return device.id
}
export const createUniqueIdFromDeviceForMap = (device: any) : string => {
    return device.id.split("-").join("_") + "__" + (new Date()).getTime()
}
export const createUniqueAttribute = (attribute: any) => {    
    return attribute.device.id + "__" + attribute.name
}
export const createUniqueDOMAttribute = (attribute: any) => {    
    const unique = createUniqueAttribute(attribute)
    return unique.split(":").join("-")
}
