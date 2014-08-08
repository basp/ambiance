class World {
    private objects = {}

    create() {
        var id = 0
        var obj = { id: id }
        this.objects[id] = obj
        return obj
    }

    object(id) {
        return this.objects[id]
    }


}