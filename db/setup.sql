create table if not exists author
(
	id int auto_increment
		primary key,
	firstName varchar(255) not null,
	lastName varchar(255) not null
);

create table if not exists book
(
	id int auto_increment
		primary key,
	title varchar(255) not null
);

create table if not exists author_books_book
(
	authorId int not null,
	bookId int not null,
	primary key (authorId, bookId),
	constraint FK_34342925729041ac5301b289a9a
		foreign key (bookId) references book (id)
			on delete cascade,
	constraint FK_e9ac29df6d093aa0b8079f1d151
		foreign key (authorId) references author (id)
			on delete cascade
);

create index IDX_34342925729041ac5301b289a9
	on author_books_book (bookId);

create index IDX_e9ac29df6d093aa0b8079f1d15
	on author_books_book (authorId);
