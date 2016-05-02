function init() {
    var sequences = {};
    var regexSequence = new RegExp($.RedmineCalc.prefix + "sequence\\s+([0-9a-zA-Z_]+)\\('([^']*)'\\)" + $.RedmineCalc.postfix, 'g');

    function parseSequenceDefs(text) {
        return text.replace(regexSequence, function (all, name, format) {
            var sequence = {
                id: "s_" + ($.RedmineCalc.lastId++),
                name: name,
                format : format,
                elements : [],
                total : 0
            };
            sequences[name] = sequence;
            return "";
        });
    };
    function parseSequenceElements(text) {
        var regex = /\{c:([0-9a-zA-Z_]+)\s+([^}]*)\}/g;
        return text.replace(regex, function (all, name, raw) {
            var sequence = sequences[name];
            if (!sequence) {
                return "<b>ERROR: Unknown sequence '" + name + "'</b>";
            }
            var formatParts = sequence.format.split("###");
            if (formatParts.length !== 2) {
                return "<b>ERROR: Invalid format. Expected: {LAND}###{FORMAT}. For example: de-DE###0.0[,]00 $<b>";
            }
            if (formatParts[0].trim().length > 0) {
                numbro.language(formatParts[0]);
            }

            var totalPattern = /total\(([^)]+)\)/;
            var totalMatcher = totalPattern.exec(raw);
            var id = name + "_" + ($.RedmineCalc.lastId++);
            if (totalMatcher) {
                var totalSequenceName = totalMatcher[1];
                var totalSequence = sequences[totalSequenceName];
                if (!totalSequence) {
                    return "<b>ERROR: Unknown sequence '" + totalSequenceName + "'</b>";
                }
                var highlightSequence = totalSequence.elements.map(function (e) { return "#" + e.id; }).join(",");
                var addToSequence = totalSequenceName !== name;
                var rawValue = totalSequence.total.toString();
            } else {
                addToSequence = true;
                rawValue = raw;
            }

            var formatted = numbro(rawValue).format(formatParts[1]);
            if (addToSequence) {
                var element = {
                    id : id,
                    formatted : formatted,
                    raw : rawValue,
                    domElement : null
                };
                sequence.total = sequence.total + parseFloat(rawValue);
                sequence.elements.push(element);
            }

            var highlightSequencePart = "";
            if (highlightSequence) {
                var highlightSequencePart = " data-seq-highlight-sequence=\"" + highlightSequence + "\" ";
            }
            return "<span class=\"RedmineCalc-element " + sequence.id + "\" id=\"" + id + "\" title=\"" + rawValue + "\" data-seq-name=\"" + name + "\"" + highlightSequencePart + ">" + formatted + "</span>";
        });
    }

    $('*:not(textarea)', 'body')
        .andSelf()
        .contents()
        .filter(function(){
            return this.nodeType === 3;
        })
        .filter(function(){
            return this.nodeValue.indexOf('{c:') !== -1;
        }).each(function(){
            var text = parseSequenceDefs(this.nodeValue);
            text = parseSequenceElements(text);
            $(this).replaceWith(text);
        });
    $('body').on("mouseenter", "span.RedmineCalc-element", function() {
        var selector = $(this).attr("data-seq-highlight-sequence");
        if (selector) {
            $(selector).addClass("RedmineCalc-element-hl");
        }
    });
    $('body').on("mouseleave", "span.RedmineCalc-element", function() {
        var selector = $(this).attr("data-seq-highlight-sequence");
        if (selector) {
            $(selector).removeClass("RedmineCalc-element-hl");
        }
    });
}
$(init);

$(document).ajaxComplete(function () {
    init();
});

