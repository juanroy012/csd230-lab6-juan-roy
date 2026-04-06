/// Book entity matching the backend /api/rest/books endpoint.
class BookModel {
  const BookModel({
    required this.id,
    required this.name,
    required this.author,
    required this.price,
    required this.copies,
  });

  final int id;
  final String name;
  final String author;
  final double price;
  final int copies;

  bool get inStock => copies > 0;

  factory BookModel.fromJson(Map<String, dynamic> json) => BookModel(
        id: json['id'] as int,
        name: (json['name'] ?? json['title'] ?? '') as String,
        author: (json['author'] ?? '') as String,
        price: (json['price'] as num).toDouble(),
        copies: (json['copies'] ?? 0) as int,
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'author': author,
        'price': price,
        'copies': copies,
      };

  BookModel copyWith({
    int? id,
    String? name,
    String? author,
    double? price,
    int? copies,
  }) =>
      BookModel(
        id: id ?? this.id,
        name: name ?? this.name,
        author: author ?? this.author,
        price: price ?? this.price,
        copies: copies ?? this.copies,
      );
}

