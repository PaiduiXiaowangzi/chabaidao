export const MenuButton = function() {
    const menuButton = uni.getStorageSync('MenuButton')
    const top = menuButton.top + 'px'
    const height = menuButton.height + 'px'
    const left = menuButton.left - 30 + 'px'
    const width = menuButton.width + 20 + 'px'
    const seViewHeight = menuButton.height + menuButton.top + 'px'
    return {
        top,
        height,
        left,
        width,
        seViewHeight
    }
}