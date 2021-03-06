$(function() {
    $.ajax({
        url: "autocomplete",
        dataType: "json",
        success: function(data) {
            var counter = 0;
            var json = $.map(data, function(item, counter) {

                //Truncate item.label
                if(item.label.length > 30){
                    item.label = item.label.substr(0,30) + '...';
                }

                return {
                    label: item.label,
                    value: item.label,
                    id: item.value
                };
            });

            $(".search-ticket").autocomplete({
                delay: 25,
                source: json,
                minLength: 3,
                autoFocus: true,
                select: function( event, ui ) {
                    $.ajax({
                        url: 'add/' + ui.item.id,
                        type: 'post',
                        dataType: "json",
                        success: function (data) {
                            if(data.status) {
                                $('.search-ticket').val('');
                                addTicketRow(data.ticket, ui.item.id);
                            }
                        }
                    });
                }
            });

            function addTicketRow(data, ixBug) {
                data = missingData(data);
                html = '<tr data-ixBug="' + ixBug + '">';
                html += '<td>' + ixBug + '</td><td><a href="' + data.url + ixBug +'">' + data.sTitle + '</a></td><td>' + data.sFixFor + '</td><td>' + data.sProject + '</td><td>' + data.sPersonAssignedTo + '</td>';
                html += '<td><div class="btn-group pull-right"><a class="btn arrow-up" href="#"><i class="icon-arrow-up"></i></a><a class="btn arrow-down" href="#"><i class="icon-arrow-down"></i></a><a class="btn btn-danger trigger-modal-delete" href="#"><i class="icon-trash"></i></a></div></td>';
                html += '</tr>';
                row = $('.table-tickets tbody').prepend(html);
                updateAllPosition();
            }

            function missingData(data) {
                //Add muted none div to undefined or undecided content
                for (entry in data) {
                    if(data[entry] === undefined || data[entry].indexOf('Undecided') >= 0 ) {
                        data[entry] = '<span class="muted">Undecided</span>';
                    }
                }
                return data;
            }
        }
    });
});