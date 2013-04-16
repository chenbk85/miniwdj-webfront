
function _getSizeStr(i) {
    if (!i) {
        return "0 KB";
    }
    var ret = "";
    if (i / 1000000.0 > 1) {
        if (i / 1000000.0 > 100) {
            ret = (i / 1000000.0).toFixed(0) + " MB"
        } else {
            ret = (i / 1000000.0).toFixed(1) + " MB"
        }
    } else {
        ret = (i / 1000.0).toFixed(0) + " KB"
    }
    return ret;
}
function init() {
    $('.down-tab').on('click',
    function() {
        $(this).addClass('down-tab-current');
        $('.apps-tab').removeClass('apps-tab-current');
        $('.up-tab').removeClass('up-tab-current');
        $('.task-content').show();
        $('.update-content').hide();
        $('.allapps-content').hide();
        window.location.href = "app:log:downtab";
    });
    $('.apps-tab').on('click',
    function() {
        $(this).addClass('apps-tab-current');
        $('.down-tab').removeClass('down-tab-current');
        $('.up-tab').removeClass('up-tab-current');
        $('.task-content').hide();
        $('.update-content').hide();
        $('.allapps-content').show();
        window.location.href = "app:log:apptab";
    });
    $('.up-tab').on('click',
    function() {
        $(this).addClass('up-tab-current');
        $('.down-tab').removeClass('down-tab-current');
        $('.apps-tab').removeClass('apps-tab-current');
        $('.task-content').hide();
        $('.update-content').show();
        $('.allapps-content').hide();
        window.location.href = "app:log:updatteab";
    });
}

$(document).ready(function() {
    //$('#scrollbar1').tinyscrollbar();
    init();

    var DownloadItem = Backbone.Model.extend({
        defaults: {
            "img": "./images/default-icon.png",
            "progress": 0,
            "total_bytes": 0,
            "current_bytes": 0,
            "status": "downloading"
        }
    });

    var DownloadItems = Backbone.Collection.extend({
        model: DownloadItem
    });

    var DownloadItemView = Backbone.View.extend({
        tagName: "li",
        className: "item",
        template: _.template($('#item-template').html()),
        events: {
            "click .action": "onaction",
            "click .delete": "onclickdelete"
        },
        onaction: function() {
            //alert(this.model.get("status"));
            if (this.model.get("status") == "downloading") {
                window.location.href = "app:download_pause:" + this.model.get("id");
                this.model.status = "pause";
                this.model.set(this.model);
                //window.external.call(JSON.stringify({event: "pause", id: this.model.get("id") ,page:"task"}));
            } else if (this.model.get("status") == "downloaded") {
                window.location.href = "app:install:" + this.model.get("id");
                //this.model.status = "installing";
                //this.model.set(this.model);
            } else if (this.model.get("status") == "pause") {
                window.location.href = "app:download_resume:" + this.model.get("id");
                this.model.status = "downloading";
                this.model.set(this.model);
                //window.external.call(JSON.stringify({event: "resume", id: this.model.get("id") , page:"task"}));
            } else if (this.model.get("status") == "install-failed") {
                window.location.href = "app:install:" + this.model.get("id");
            }
        },
        onclickdelete: function() {
            window.location.href = "app:download_del:" + this.model.get("id");
            downloadItemCollection.remove(this.model.get("id"))
            //window.external.call(JSON.stringify({event: "delete", id: this.model.get("id") , page:"task"}));
        },
        initialize: function() {
            this.listenTo(this.model, "change:name", this.onNameChanged);
            this.listenTo(this.model, "change:img", this.onImgChanged);
            this.listenTo(this.model, "change:status", this.onStatusChanged);

            this.listenTo(this.model, "change:total_bytes", this.onTotalByteChanged);
            this.listenTo(this.model, "change:current_bytes", this.onCurByteChanged);
            this.listenTo(this.model, "change:progress", this.onProgressChanged);
            this.listenTo(this.model, "remove", this.remove);
        },
        remove: function() {
            this.$el.remove();
        },

        onTotalByteChanged: function(item) {
            this.$(".t-tot-bytes").html(_getSizeStr(item.get("total_bytes")));
            item.stop_propagation = true;
        },
        onCurByteChanged: function(item) {
            this.$(".t-cur-bytes").html(_getSizeStr(item.get("current_bytes")));
            item.stop_propagation = true;
        },
        onStatusChanged: function(item) {
            if (this.model.get("status") == "downloading") {
                this.$(".action").removeClass("continue");
                this.$(".action").addClass("pause");
            } else if (this.model.get("status") == "pause") {
                this.$(".action").addClass("continue");
                this.$(".action").removeClass("pause");
            } else {
                this.render();
            }
            item.stop_propagation = true;
        },
        onProgressChanged: function(item) {
            if (item.get("progress") && item.get("progress") > 0) this.$(".progressBar").progressBar(item.get("progress"));
            item.stop_propagation = true;
        },
        onNameChanged: function(item) {
            this.$(".name").html(item.get("name"));
            item.stop_propagation = true;
        },
        onImgChanged: function(item) {
            this.$(".icon").attr("src", item.get("img"));
            item.stop_propagation = true;
        },
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            var progress = this.model.get("progress") || 0;
            this.$(".progressBar").progressBar(progress, {
                barImage: './images/percentImage.png',
                showText: false,
                width: 110 
            });
            return this;
        }
    });

    var DownloadItemCollectionView = Backbone.View.extend({
        initialize: function() {
            this.listenTo(this.collection, "add", this.addHandler);
            //this.listenTo(this.collection, "reset", this.onReset);
        },
        addHandler: function(item) {
            var v = new DownloadItemView({
                model: item
            });
            var html_obj = null;
            //console.log($("#items li").length)
            if ($("#items li").length % 2 == 1) {
                html_obj = v.render().$el;
                html_obj.addClass("even");
            } else {
                html_obj = v.render().$el;
            }
            $("#items").prepend(html_obj);
        }
    });

    downloadItemCollection = new DownloadItems();
    downloadItemCollectionView = new DownloadItemCollectionView({
        collection: downloadItemCollection
    });
    downloadItemCollectionView.render();
    window.location.href = "app:onload";
});

function AddDownloadItem(val) {
    val.current_bytes = val.cur_bytes || 0;
    val.total_bytes = val.total_bytes || 0;
    if (val.total_bytes > 0) {
        val.progress = (1.0 * val.current_bytes / val.total_bytes) * 100;
    } else {
        val.progress = 0;
    }
    val.name = decodeURIComponent(val.name)
    val.status = val.status || "downloading";
    downloadItemCollection.add(val);
    $('#scrollbar1').miniScrollBar();
    $('.down-tab').click();
}

function UpdateDownloadAppInfo(id, val) {
    var m = downloadItemCollection.get(id);
    m.name = val.name;
    m.set(m);
}
function UpdateDownloadStatus(val) {
    var id = val.id;
    if (val.status == "delete") {
        downloadItemCollection.remove(id);
        return;
    }
    var m = downloadItemCollection.get(id);
    m.status = val.status;
    m.msg = val.msg
    m.set(m);
}
function UpdateDownloadInfo(val) {
    var m = downloadItemCollection.get(val.id);
    m.current_bytes = val.cur_bytes;
    m.total_bytes = val.total_bytes;
    m.progress = val.progress;
    m.set(m);
}